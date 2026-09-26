[default]
@build: buildFirmware buildWeb
  mkdir -p "build"
  rm -rf "build/*"
  cp "firmware/target/thumbv6m-none-eabi/release/firmware.uf2" "build/"

  cp -r web/dist/* build/

@buildFirmware:
  cd firmware && cargo deploy --release

@buildWeb:
  cd web && bun run build

@deployDev:
  cd firmware && cargo deploy
  cp "firmware/target/thumbv6m-none-eabi/debug/firmware.uf2" "D:/"

@deploy:
  cd firmware && cargo deploy --release
  cp "firmware/target/thumbv6m-none-eabi/release/firmware.uf2" "D:/"

[parallel]
@dev: firmware web
@firmware:
  cd firmware && cargo deploy
  cp "firmware/target/thumbv6m-none-eabi/debug/firmware.uf2" "build"

@web:
  cd web && bun run dev

[parallel]
@devProbe: web firmwareProbe

@firmwareProbe:
   cd firmware && cargo run

@setup:
  rustup target add thumbv6m-none-eabi
  cargo install elf2uf2-rs
  cd web && bun install