PROTO_DIR=app/proto
OUT_DIR=app/proto

.PHONY: proto run docker-build docker-up docker-down

proto:
	@echo "Generating protobuf files..."
	protoc --proto_path=$(PROTO_DIR) --python_out=$(OUT_DIR) $(PROTO_DIR)/sensor_reading.proto
	@echo "Done."

run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

docker-build:
	docker compose build --no-cache backend

docker-up:
	docker compose up -d

docker-down:
	docker compose down