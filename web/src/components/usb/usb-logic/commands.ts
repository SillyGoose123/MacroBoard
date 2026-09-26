import {Command} from "@/../bindings/Command.ts";
import type {Config} from "@/../bindings/Config";
import {parseConfig} from "./byte_deserializer.ts";
import {configToBytes, flashToBytes} from "./byte_serializer.ts";
import {usbPid, usbVid} from "../../../../bindings/const.ts";
import type {Tone} from "../../../../bindings/Tone.ts";
import type {Flash} from "../../../../bindings/Flash";

const ENDPOINT: number = 3;
const filters: USBDeviceRequestOptions = {
  filters: [
    {vendorId: usbVid, productId: usbPid}
  ]
};

async function sendCommand(device: USBDevice, command: Command, numbers: Uint8Array): Promise<boolean> {
  if (command === Command.getConfig) throw "Please use read_config for this command!";

  let status = await device.transferOut(ENDPOINT, Uint8Array.from([command.valueOf(), ...numbers]));
  if (status.status !== "ok") return false;

  let result = await device.transferIn(ENDPOINT, 1);
  if (result.status !== "ok" || result.data == undefined) return false;
  return result.data.getUint8(0) === 0;
}

export async function initDevice(): Promise<USBDevice> {
  let device = await navigator.usb.requestDevice(filters);
  await device.open();
  if (device.configuration === null) await device.selectConfiguration(0);
  await device.claimInterface(3);
  return device;
}

export async function beep(device: USBDevice, tone: Tone): Promise<boolean> {
  return sendCommand(device, Command.summ, Uint8Array.of(tone.valueOf()));
}

export async function flash(device: USBDevice, flash: Flash): Promise<boolean> {
  return sendCommand(device, Command.flash, Uint8Array.of(...flashToBytes(flash)));
}

export async function readConfig(device: USBDevice): Promise<Config> {
  let status = await device.transferOut(ENDPOINT, Uint8Array.from([Command.getConfig.valueOf()]));
  if (status.status !== "ok") throw "Transfer command failed!";

  let result = await device.transferIn(ENDPOINT, 5);
  if (result.status !== "ok"
    || result.data == undefined
    || result.data.getUint8(0) !== 0)
    throw "Getting config failed!";

  let configLength = result.data.getUint32(1, true);
  let config = await device.transferIn(ENDPOINT, configLength)
  if (config.status !== "ok" || result.data == undefined) throw "Reading config failed!";
  return parseConfig(config.data!);
}

export async function updateConfig(device: USBDevice, config: Config): Promise<boolean> {
  return sendCommand(device, Command.changeConfig, configToBytes(config));
}
