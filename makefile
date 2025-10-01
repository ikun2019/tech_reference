SCRIPTS_IMAGE=scripts-image


build:
	docker build -t ${SCRIPTS_IMAGE} --platform linux/amd64 -f scripts/Dockerfile .

# gRPC
pb/%:
	docker run --rm --platform linux/amd64 \
	-v $(shell pwd)/scripts:/app/scripts \
	-v ${shell pwd}/proto:/app/proto \
	-v $(shell pwd)/services/$*_service/proto:/app/$*_service/proto \
	-v $(shell pwd)/gateway/proto:/app/gateway/proto \
	${SCRIPTS_IMAGE} bash /app/scripts/proto-gen.sh $*