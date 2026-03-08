import {Command} from "@/../bindings/Command.ts";
import type {Config} from "@/../bindings/Config";
import {parseConfig} from "@/components/Usb/utils/byte_deserializer.ts";
import {configToBytes} from "@/components/Usb/utils/byte_serializer.ts";

const ENDPOINT: number = 3;

export async function sendCommand(device: USBDevice, command: Command, numbers: Uint8Array): Promise<boolean> {
  if (command === Command.getConfig) throw "Please use read_config for this command!";

  let status = await device.transferOut(ENDPOINT, Uint8Array.from([command.valueOf(), ...numbers]));
  if (status.status !== "ok") return false;

  let result = await device.transferIn(ENDPOINT, 1);
  if (result.status !== "ok" || result.data == undefined) return false;
  return result.data.getUint8(0) === 0;
}

export async function initDevice(device: USBDevice): Promise<Config> {
  await device.open();
  if (device.configuration === null) await device.selectConfiguration(0);
  await device.claimInterface(3);
  return readConfig(device);
}

export async function readConfig(device: USBDevice): Promise<Config> {
  let status = await device.transferOut(ENDPOINT, Uint8Array.from([Command.getConfig.valueOf()]));
  if (status.status !== "ok") throw "Transfer command failed!";

  let result = await device.transferIn(ENDPOINT, 5);
  if (result.status !== "ok"
      || result.data == undefined
      || result.data.getUint8(0) !== 0)
    throw "Getting ConfigEditor failed!";

  let configLength = result.data.getUint32(1, true);
  let config = await device.transferIn(ENDPOINT, configLength)
  if (config.status !== "ok" || result.data == undefined) throw "Reading ConfigEditor failed!";
  return parseConfig(config.data!);
}

export async function updateConfig(device: USBDevice, config: Config): Promise<boolean> {
  return sendCommand(device, Command.changeConfig, configToBytes(config));
}
