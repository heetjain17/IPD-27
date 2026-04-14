-- Trigger function to automatically update place rating stats
CREATE OR REPLACE FUNCTION sync_place_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE places
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)
    )
  WHERE id = COALESCE(NEW.place_id, OLD.place_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync place ratings on review changes
CREATE TRIGGER trg_sync_place_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION sync_place_rating();
