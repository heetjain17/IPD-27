import json
import os
import pandas as pd

INPUT_FILE = "../backend/data-scripts/processedData/versova/versova_compiled.json"
OUTPUT_FILE = "../backend/data-scripts/xlsxData/versova_places.xlsx"

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

rows = []

for place in data:
    row = {
        # ===== PLACES TABLE COLUMNS =====
        "id": place.get("id"),
        "name": place.get("name"),
        "description": place.get("description"),
        "lat": place.get("lat"),
        "lng": place.get("lng"),
        "geom": "",
        "category": place.get("category"),
        "source": place.get("source", "google"),
        "external_id": place.get("external_id"),
        "address": place.get("address"),
        "google_types": ", ".join(place.get("google_types", [])),
        "area": place.get("area"),
        "opening_hours": place.get("opening_hours"),
        "contact_phone": place.get("contact_phone"),
        "website_url": place.get("website_url"),
        "price_level": place.get("price_level"),
        "last_synced_at": place.get("last_synced_at"),
        "is_active": place.get("is_active", True),
        "custom_description": place.get("custom_description", ""),
        "vibe": place.get("vibe", ""),
        "is_hidden_gem": place.get("is_hidden_gem", False),
        "priority_score": place.get("priority_score", 0),
        "verified": place.get("verified", False),
        "best_time_to_visit": place.get("best_time_to_visit", ""),
        "avg_cost_for_two": place.get("avg_cost_for_two"),
        "crowd_level_override": place.get("crowd_level_override", ""),
        "notes": place.get("notes", ""),
        "average_rating": place.get("average_rating", 0),
        "review_count": place.get("review_count", 0),
        "created_by": place.get("created_by"),
        "created_at": place.get("created_at"),
        "updated_at": place.get("updated_at"),
    }

    rows.append(row)

df = pd.DataFrame(rows)

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
df.to_excel(OUTPUT_FILE, index=False)

print(f"Excel file created at: {OUTPUT_FILE}")
