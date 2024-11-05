-- up
CREATE TABLE "emails" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "date" TIMESTAMP(3) NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT,
  "client_id" TEXT NOT NULL,
  "extraction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "emails_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER notify_emails_new_record
AFTER INSERT ON "emails"
FOR EACH ROW
EXECUTE FUNCTION notify_new_record();

-- down
DROP TRIGGER IF EXISTS notify_emails_new_record ON "emails";

DROP TABLE "emails";
