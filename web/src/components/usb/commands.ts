import {Command} from "../../../bindings/Command.ts";
import type {Config} from "../../../bindings/Config";
import {parseConfig} from "@/components/usb/bytes_parser.ts";


const ENDPOINT: number = 3;

export async function sendCommand(device: USBDevice, command: Command, numbers: Uint8Array): Promise<boolean> {
  if(command === Command.getConfig) throw "Please use read_config for this command!";

  let status = await device.transferOut(ENDPOINT, Uint8Array.from([command.valueOf(), ...numbers]));
  if(status.status !== "ok") return false;

  let result = await device.transferIn(ENDPOINT, 1);
  if(result.status !== "ok" || result.data == undefined) return false;
  return result.data.getUint8(0) === 0;
}

export async function initDevice(device: USBDevice): Promise<Config> {
  await device.open();
  if (device.configuration === null) await device.selectConfiguration(0);
  await device.claimInterface(3);
  return read_config(device);
}

export async function read_config(device: USBDevice): Promise<Config> {
  let status = await device.transferOut(ENDPOINT, Uint8Array.from([Command.getConfig.valueOf()]));
  if(status.status !== "ok") throw "Transfer command failed!";

  let result = await device.transferIn(ENDPOINT, 5);
  if(result.status !== "ok"
      || result.data == undefined
      || result.data.getUint8(0) !== 0)
    throw "Getting config failed!";

  let configLength = result.data.getUint32(1, true);
  let config = await device.transferIn(ENDPOINT, configLength)
  if(config.status !== "ok" || result.data == undefined) throw "Reading config failed!";
  console.log(config.data)
  return parseConfig(config.data!);
}

