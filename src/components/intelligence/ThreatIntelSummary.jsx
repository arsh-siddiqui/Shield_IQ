import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { normalizeVTState } from '../../utils/intelligenceMapping';

export default function ThreatIntelSummary({ intelligence }) {
  const vt = intelligence?.virusTotal || intelligence?.virustotal;

  if (!intelligence || !vt) {
    return (
      <div className="bg-card/40 rounded-xl p-5 border border-border flex items-center justify-center text-secondary text-sm">
        No threat intelligence available.
      </div>
    );
  }

  const stateInfo = normalizeVTState(vt);

  // Icon mapping
  let Icon = HelpCircle;
  let colorClass = 'text-secondary';
  let bgClass = 'bg-secondary/10';
  let borderClass = 'border-border';

  if (stateInfo.state === 'clean') {
    Icon = ShieldCheck;
    colorClass = 'text-success';
    bgClass = 'bg-success/10';
    borderClass = 'border-success/30';
  } else if (stateInfo.state === 'suspicious') {
    Icon = AlertTriangle;
    colorClass = 'text-warning';
    bgClass = 'bg-warning/10';
    borderClass = 'border-warning/30';
  } else if (stateInfo.state === 'malicious') {
    Icon = ShieldAlert;
    colorClass = 'text-danger';
    bgClass = 'bg-danger/10';
    borderClass = 'border-danger/30';
  }

  // Derive simple message
  let summaryText = vt.summary;
  if (!summaryText) {
    if (stateInfo.state === 'clean') summaryText = "VirusTotal found no malicious detections.";
    else if (stateInfo.state === 'malicious') summaryText = "VirusTotal identified malicious detections for this indicator.";
    else if (stateInfo.state === 'suspicious') summaryText = "VirusTotal flagged this indicator as suspicious.";
    else if (stateInfo.state === 'unknown' || stateInfo.state === 'not_found') summaryText = "The indicator was not observed by this provider.";
    else summaryText = "Threat intelligence is currently unavailable.";
  }

  return (
    <div className={`rounded-xl border ${borderClass} bg-card overflow-hidden flex flex-col h-full`}>
      <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
        <h4 className="font-semibold text-primary">VirusTotal</h4>
        <div className={`px-2.5 py-1 rounded flex items-center gap-1.5 ${bgClass} ${colorClass} border ${borderClass}`}>
          <Icon className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{stateInfo.label}</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-center">
        <p className="text-sm font-medium text-primary mb-4 leading-relaxed">
          {summaryText}
        </p>

        {vt.totalEngines > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <div className="text-xs text-secondary uppercase tracking-wider mb-1">Engines Checked</div>
              <div className="text-3xl font-bold font-mono text-primary">{vt.totalEngines}</div>
            </div>
            <div>
              <div className="text-xs text-secondary uppercase tracking-wider mb-1">Detections</div>
              <div className="text-base flex flex-col gap-1 mt-1">
                <span className={vt.maliciousVotes > 0 ? 'text-danger font-bold flex items-center gap-1' : 'text-primary font-bold flex items-center gap-1'}>
                  <div className={`w-2.5 h-2.5 rounded-full ${vt.maliciousVotes > 0 ? 'bg-danger' : 'bg-success'}`}></div>
                  {vt.maliciousVotes} malicious
                </span>
                <span className={vt.suspiciousVotes > 0 ? 'text-warning font-bold flex items-center gap-1' : 'text-secondary font-medium flex items-center gap-1'}>
                  <div className={`w-2 h-2 rounded-full ${vt.suspiciousVotes > 0 ? 'bg-warning' : 'bg-border'}`}></div>
                  {vt.suspiciousVotes} suspicious
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Confidence only shown if there is a threat (as specified by user to avoid misleading '0% safe') */}
        {vt.totalEngines > 0 && vt.confidence > 0 && stateInfo.state !== 'clean' && (
          <div className="mb-4">
             <div className="text-xs text-secondary uppercase tracking-wider mb-1">Confidence Score</div>
             <div className="text-sm font-bold text-primary">{vt.confidence}%</div>
          </div>
        )}

        {vt.checkedAt && (
          <div className="mt-auto flex items-center gap-1.5 text-xs text-muted pt-3 border-t border-border/50">
            <Clock className="w-3.5 h-3.5" />
            <span>Last checked: {format(new Date(vt.checkedAt), 'MMM d, yyyy HH:mm')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
