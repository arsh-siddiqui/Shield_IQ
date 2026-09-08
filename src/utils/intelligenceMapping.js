/**
 * Centralized mapping utility to normalize indicator intelligence and geolocation
 * for consistent frontend display.
 */

export function indicatorToGeoPoint(indicator) {
  if (!indicator || !indicator.geolocation) {
    return null;
  }

  const geo = indicator.geolocation;

  // Resolve latitude and longitude from possible backend field names
  const rawLat = geo.latitude !== undefined ? geo.latitude : geo.lat;
  const rawLon = geo.longitude !== undefined ? geo.longitude : geo.lon;

  const latitude = typeof rawLat === 'string' ? parseFloat(rawLat) : rawLat;
  const longitude = typeof rawLon === 'string' ? parseFloat(rawLon) : rawLon;

  // Must be finite numbers
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  // Must be within valid map ranges
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  // Do not show on public map if it's explicitly marked private
  if (indicator.type === 'ip' && indicator.isPublicIP === false) {
    return null;
  }
  // Alternate private IP check logic for some payloads
  if (indicator.type === 'ip' && indicator.type === 'private') {
    return null;
  }
  if (geo.status !== 'success' && !latitude && !longitude) {
    return null;
  }

  // Resolve VirusTotal threat state if attached to indicator
  let threat = 'unknown';
  let vtStatus = null;
  
  const vt = indicator.intelligence?.virustotal || indicator.intelligence?.virusTotal || indicator.virusTotal;
  if (vt) {
    vtStatus = vt.status;
    if (vt.threat) {
      threat = vt.threat;
    }
  } else if (indicator.threatStatus) {
    threat = indicator.threatStatus;
  }

  return {
    ip: indicator.value,
    latitude,
    longitude,
    country: geo.country || null,
    countryCode: geo.countryCode || null,
    region: geo.region || null,
    city: geo.city || null,
    asn: geo.asn || null,
    organization: geo.organization || null,
    isp: geo.isp || null,
    threat,
    vtStatus
  };
}

export function normalizeVTState(virusTotal) {
  if (!virusTotal) return { state: 'unconfigured', label: 'Not configured' };
  
  if (virusTotal.status === 'skipped') return { state: 'skipped', label: 'Not configured' };
  if (virusTotal.status === 'not_found') return { state: 'not_found', label: 'Not observed by provider' };
  
  if (['error', 'timeout', 'rate_limited'].includes(virusTotal.status)) {
    return { state: 'unavailable', label: 'Threat intelligence unavailable' };
  }
  
  if (virusTotal.status === 'available') {
    if (virusTotal.threat === 'clean') return { state: 'clean', label: 'Clean' };
    if (virusTotal.threat === 'malicious') return { state: 'malicious', label: 'Malicious' };
    if (virusTotal.threat === 'suspicious') return { state: 'suspicious', label: 'Suspicious' };
    return { state: 'unknown', label: 'Unknown' };
  }

  return { state: 'unknown', label: 'Unknown' };
}

export function buildMapGeoJSON(geoPoints = []) {
  const validPoints = geoPoints.filter((p) => {
    const lat = parseFloat(p.latitude);
    const lon = parseFloat(p.longitude);
    return Number.isFinite(lat) && Number.isFinite(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }).map((p) => ({
    ...p,
    latitude: parseFloat(p.latitude),
    longitude: parseFloat(p.longitude),
    threat: p.threat || 'unknown'
  }));

  return {
    type: "FeatureCollection",
    features: validPoints.map((p) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [p.longitude, p.latitude],
      },
      properties: {
        ip: p.ip || 'Unknown IP',
        country: p.country || '',
        city: p.city || '',
        asn: p.asn || '',
        isp: p.isp || '',
        threat: p.threat,
        vtStatus: p.vtStatus || ''
      },
    })),
  };
}
