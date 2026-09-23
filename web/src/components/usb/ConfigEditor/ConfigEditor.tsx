import type {Config} from "@/../bindings/Config"
import styles from "@/components/usb/ConfigEditor/ConfigEditor.module.css";
import {ConfigDialog} from "@/components/usb/ConfigEditor/ConfigDialog/ConfigDialog.tsx";
import {ConfigType} from "@/components/usb/ConfigEditor/ConfigDialog/ConfigType/ConfigType.tsx";
import {manufacturer, product} from "@/../bindings/const.ts";
import {Command} from "@/../bindings/Command.ts";
import {Tone} from "@/../bindings/Tone.ts";
import {Button} from "@/shadcn/components/ui/button.tsx";
import {useCallback} from "react";
import type {Action} from "@/../bindings/Action.ts";
import type {KnobAction} from "@/../bindings/KnobAction";
import type {Effect} from "@/../bindings/Effect";
import {RefreshCcw, Save} from "lucide-react";

type ConfigEditorProps = {
  config: Config;
  executeCommand: (command: Command, data: number[], silent: boolean) => Promise<void>,
  wasChanged: boolean,
  save: () => Promise<void>,
  reset: () => Promise<void>,
  changeConfig: (config: Config) => void,
  error: string | null,
}
export type ConfigOptions = Action[] | KnobAction | Effect;

//TODO: REFACTOR
export function ConfigEditor({
                               config,
                               executeCommand,
                               wasChanged,
                               save,
                               changeConfig,
                               reset,
                               error
                             }: ConfigEditorProps) {
  const topLevelUpdate = useCallback((changes: ConfigOptions) => {
    changeConfig({...config, ...changes})
  }, [config]);

  const switchUpdate = useCallback((changes: ConfigOptions, index: number) => {
    let newConfig: Config = {...config};
    newConfig.switchAction[index] = changes as Action[];
    changeConfig(newConfig);
  }, [config]);


  return <div className={styles.configEditor}>
    <span color={"var(--destructive)"}>{error ?? ""}</span>
    <div className={styles.row}>
      {ConfigType.MCU}
      <ConfigDialog type={ConfigType.Knob}
                    config={config.knobAction}
                    changeConfig={topLevelUpdate}
                    executeCommand={executeCommand}
      />

      {[...Array(2)].map((_, i) => (
          <ConfigDialog type={ConfigType.Switch}
                        config={config.switchAction[i]}
                        changeConfig={(newConfig) => {
                          switchUpdate(newConfig, i)
                        }}
                        key={`switch-${i}`}
                        executeCommand={executeCommand}
          />
      ))}

      <div onClick={() => executeCommand(Command.summ, [Tone.default], true)}>
        {ConfigType.Summer}
      </div>
    </div>

    <div className={styles.row}>
      <ConfigDialog
          type={ConfigType.LED}
          config={config.effect}
          changeConfig={topLevelUpdate}
          executeCommand={executeCommand}
      />

      {[...Array(4)].map((_, i) => (
          <ConfigDialog type={ConfigType.Switch}
                        config={config.switchAction[i + 2]}
                        changeConfig={(newConfig) => {
                          switchUpdate(newConfig, i + 2)
                        }}
                        key={`switch-${(i + 2)}`}
                        executeCommand={executeCommand}
          />
      ))}
      <ConfigDialog
          type={ConfigType.LED}
          config={config.effect}
          changeConfig={topLevelUpdate}
          executeCommand={executeCommand}
      />
    </div>
    <div className={styles.row}>
      <ConfigDialog
          type={ConfigType.LED}
          config={config.effect}
          changeConfig={topLevelUpdate}
          executeCommand={executeCommand}
      />
      <span>Created by {manufacturer}</span>
      <ConfigDialog
          type={ConfigType.LED}
          config={config.effect}
          changeConfig={topLevelUpdate}
          executeCommand={executeCommand}
      />
      <span>{product}</span>
      <ConfigDialog
          type={ConfigType.LED}
          config={config.effect}
          changeConfig={topLevelUpdate}
          executeCommand={executeCommand}
      />
    </div>

    <div className={styles.row}>
      <Button className={styles.action} disabled={!wasChanged} onClick={reset} variant={"outline"}>
        <RefreshCcw strokeWidth={1.75}/>
      </Button>
      <Button className={styles.action} disabled={!wasChanged} onClick={save} variant={"outline"}>
        <Save strokeWidth={1.75}/>
      </Button>
    </div>
  </div>
}

