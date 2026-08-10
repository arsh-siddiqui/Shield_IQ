"""
download_dataset.py — Reproducibly download the phishing email dataset from Hugging Face.

Dataset: zefang-liu/phishing-email-dataset
License: LGPL-3.0
Approximate size: ~18,650 labeled email examples
Labels: Safe Email, Phishing Email

Usage:
    python ml/download_dataset.py

Output:
    ml/data/phishing_dataset.csv   (raw download)
    ml/data/dataset_info.json      (download metadata)
"""

import json
import os
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
DATASET_NAME = "zefang-liu/phishing-email-dataset"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "data")
OUTPUT_CSV = os.path.join(OUTPUT_DIR, "phishing_dataset.csv")
INFO_FILE = os.path.join(OUTPUT_DIR, "dataset_info.json")


def main():
    print(f"[download_dataset] Downloading {DATASET_NAME} from Hugging Face...")
    print(f"[download_dataset] This may take a moment on first run (dataset is cached locally).")

    # Import here so the script fails clearly if huggingface datasets isn't installed
    try:
        from datasets import load_dataset
    except ImportError:
        print("[ERROR] 'datasets' package not found. Run: pip install datasets")
        raise

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Load dataset — uses HF cache (~/.cache/huggingface/datasets)
    dataset = load_dataset(DATASET_NAME)

    print(f"[download_dataset] Available splits: {list(dataset.keys())}")

    # Merge all available splits into a single DataFrame
    import pandas as pd

    frames = []
    for split_name, split_data in dataset.items():
        df = split_data.to_pandas()
        df["_split"] = split_name
        frames.append(df)
        print(f"[download_dataset]   {split_name}: {len(df):,} rows | columns: {list(df.columns)}")

    combined = pd.concat(frames, ignore_index=True)
    print(f"\n[download_dataset] Total rows: {len(combined):,}")
    print(f"[download_dataset] Columns: {list(combined.columns)}")

    # Identify label column and text column dynamically
    # Common patterns: 'label', 'Email Type', 'text', 'Email Text'
    label_col = None
    text_col = None
    for col in combined.columns:
        if col.lower() in ("label", "email type", "email_type"):
            label_col = col
        if col.lower() in ("text", "email text", "email_text", "body", "message"):
            text_col = col

    if label_col is None:
        # Fallback: pick first non-text column that looks like a label
        for col in combined.columns:
            if combined[col].nunique() <= 5:
                label_col = col
                break

    if text_col is None:
        # Fallback: pick the longest string column
        str_cols = [c for c in combined.columns if combined[c].dtype == object and c != label_col]
        if str_cols:
            text_col = max(str_cols, key=lambda c: combined[c].str.len().mean())

    print(f"\n[download_dataset] Detected text column: '{text_col}'")
    print(f"[download_dataset] Detected label column: '{label_col}'")

    if label_col:
        print(f"[download_dataset] Label distribution:\n{combined[label_col].value_counts()}")

    # Save to CSV
    combined.to_csv(OUTPUT_CSV, index=False)
    print(f"\n[download_dataset] Saved to: {OUTPUT_CSV}")

    # Save metadata
    info = {
        "datasetName": DATASET_NAME,
        "license": "LGPL-3.0",
        "downloadedAt": datetime.now(timezone.utc).isoformat(),
        "totalRows": len(combined),
        "splits": {k: len(v) for k, v in dataset.items()},
        "columns": list(combined.columns),
        "detectedTextColumn": text_col,
        "detectedLabelColumn": label_col,
        "labelDistribution": (
            combined[label_col].value_counts().to_dict() if label_col else {}
        ),
    }
    with open(INFO_FILE, "w") as f:
        json.dump(info, f, indent=2)
    print(f"[download_dataset] Metadata saved to: {INFO_FILE}")
    print("[download_dataset] Done.")


if __name__ == "__main__":
    main()
