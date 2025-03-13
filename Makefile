.PHONY: build
# 带缓存的构建
build:
	docker build . \
	--progress=plain \
	-t ccr.ccs.tencentyun.com/sumery/ecommerce-fe:$(VERSION) \
	--platform linux/amd64 \
	--push

.PHONY: build-nocache
# 不使用缓存的构建
build-nocache:
	docker build . \
	--progress=plain \
	--nocache \
	-t ccr.ccs.tencentyun.com/sumery/ecommerce-fe:$(VERSION) \
	--platform linux/amd64 \
	--push

buildx:
	docker buildx build . \
	--progress=plain \
	-t ccr.ccs.tencentyun.com/sumery/ecommerce-fe:$(VERSION) \
	--platform linux/amd64,linux/arm64 \
	--push
