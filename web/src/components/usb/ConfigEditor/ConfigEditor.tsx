import type {Config} from "@/../bindings/Config"
import styles from "@/components/Usb/ConfigEditor/ConfigEditor.module.css";
import {ConfigDialog} from "@/components/Usb/ConfigEditor/ConfigDialog/ConfigDialog.tsx";
import {ConfigType} from "@/components/usb/ConfigEditor/ConfigDialog/ConfigType/ConfigType.tsx";
import {manufacturer, product} from "../../../../bindings/const.ts";
import {Command} from "../../../../bindings/Command.ts";
import {Tone} from "../../../../bindings/Tone.ts";
import {Button} from "@/shadcn/components/ui/button.tsx";
import {useCallback} from "react";
import type {Action} from "../../../../bindings/Action.ts";
import type {KnobAction} from "../../../../bindings/KnobAction";
import type {Effect} from "../../../../bindings/Effect";


type ConfigEditorProps = {
  config: Config;
  executeCommand: (command: Command, data: number[], silent: boolean) => Promise<void>,
  wasChanged: boolean,
  save: () => Promise<void>,
  changeConfig: (config: Config) => void,
}
export type ConfigOptions = Action[] | KnobAction | Effect;

//TODO REFACTOR
export function ConfigEditor({config, executeCommand, wasChanged, save, changeConfig}: ConfigEditorProps) {
  const topLevelUpdate = useCallback((changes: ConfigOptions) => {
    changeConfig({...config, ...changes})
  }, [config]);

  const switchUpdate = useCallback((changes: ConfigOptions, index: number) => {
    let newConfig: Config = {...config};
    newConfig.switchAction[index] = changes as Action[];
    changeConfig(newConfig);
  }, [config]);


  return <div className={styles.configEditor}>
    <div className={styles.row}>
      {ConfigType.MCU}
      <ConfigDialog type={ConfigType.Knob}
                    config={config.knobAction}
                    changeConfig={topLevelUpdate}/>

      {[...Array(2)].map((i) => (
          <ConfigDialog type={ConfigType.Switch}
                        config={config.switchAction[i]}
                        changeConfig={(newConfig) => {
                          switchUpdate(newConfig, i)
                        }}/>
      ))}

      <div onClick={() => executeCommand(Command.summ, [Tone.default], true)}>
        {ConfigType.Summer}
      </div>
    </div>

    <div className={styles.row}>
      <ConfigDialog type={ConfigType.LED} config={config.effect} changeConfig={topLevelUpdate}/>

      {[...Array(4)].map((i) => (
          <ConfigDialog type={ConfigType.Switch}
                        config={config.switchAction[i + 2]}
                        changeConfig={(newConfig) => {
                          switchUpdate(newConfig, i + 2)
                        }}/>
      ))}
      <ConfigDialog type={ConfigType.LED} config={config.effect} changeConfig={topLevelUpdate}/>
    </div>
    <div className={styles.row}>
      <ConfigDialog type={ConfigType.LED} config={config.effect} changeConfig={topLevelUpdate}/>
      <span>Created by {manufacturer}</span>
      <ConfigDialog type={ConfigType.LED} config={config.effect} changeConfig={topLevelUpdate}/>
      <span>{product}</span>
      <ConfigDialog type={ConfigType.LED} config={config.effect} changeConfig={topLevelUpdate}/>
    </div>

    <div>
      <Button disabled={!wasChanged} onClick={save}>Save</Button>
    </div>
  </div>;
}

