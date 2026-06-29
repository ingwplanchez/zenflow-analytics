# ZenFlow Analytics — Data Schema Specification

This document defines the mandatory data structure and validation rules for CSV files ingested by the ZenFlow Analytics ETL engine. Any external application or export script must adhere to this specification to ensure compatibility.

## 1. General Specifications
- **File Format**: Comma-Separated Values (CSV)
- **Encoding**: UTF-8
- **Date/Time Format**: ISO 8601 (`YYYY-MM-DD HH:MM:SS`)
- **Delimiter**: Comma (`,`)

## 2. Mandatory Column Schema

The following columns must be present in the CSV header. Missing columns will trigger a validation error.

| Column Name | Data Type | Constraints / Allowed Values | Description |
| :--- | :--- | :--- | :--- |
| `timestamp` | `datetime64` | Required | Start date and time of the task. |
| `task_id` | `string` | Required | Unique identifier for the task. |
| `project` | `string` | Required | Project or workspace name. |
| `category` | `string` | `deep_work`, `collaboration`, `reactive`, `strategy` | Type of cognitive activity. |
| `priority` | `string` | `critical`, `high`, `medium`, `low` | Priority level. |
| `est_hours` | `float64` | $\ge 0$ | Estimated effort in hours. |
| `real_hours` | `float64` | $\ge 0$ | Actual effort invested in hours. |
| `difficulty` | `int64` | Range: `1` to `5` | Perceived task complexity. |
| `status` | `string` | `completed`, `in_progress`, `pending` | Current state of the task. |

## 3. Data Normalization & Cleaning Rules

The ETL engine applies the following transformations automatically upon ingestion:

### String Normalization
The following columns are normalized to ensure consistency regardless of the source:
- **Columns**: `category`, `priority`, `status`.
- **Rules**: All values are converted to **lowercase** and leading/trailing whitespace is **stripped**.
- *Example*: `"Completed "` $\rightarrow$ `"completed"`.

### Value Coercion
- **Numerical Clipping**:
    - `est_hours` and `real_hours` are clipped to a minimum of `0.0`.
    - `difficulty` is clipped to the range `[1, 5]`.
- **Type Enforcement**: Values are coerced to their respective types; non-numeric values in numeric columns are treated as `NaN`.

### Data Integrity (Cleaning)
Rows are **dropped** if any of the following "Critical Fields" contain null or missing values:
- `timestamp`
- `task_id`
- `project`
- `category`
- `status`

## 4. Example Dataset

A compliant CSV file should follow this structure:

```csv
timestamp,task_id,project,category,priority,est_hours,real_hours,difficulty,status
2024-06-01 09:00,T-001,AlphaProj,deep_work,high,2.0,2.5,3,completed
2024-06-01 11:30,T-002,AlphaProj,collaboration,medium,1.0,0.8,2,completed
2024-06-02 10:00,T-003,BetaProj,strategy,critical,4.0,8.0,4,completed
2024-06-02 14:00,T-004,BetaProj,reactive,low,0.5,1.2,1,in_progress
```

---
*Specification Version: 1.0.0*
