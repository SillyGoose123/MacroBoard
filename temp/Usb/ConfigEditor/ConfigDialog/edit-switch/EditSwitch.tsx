import type {ConfigOptions} from "@/ui/usb/ConfigEditor/ConfigEditor.tsx";
import {Action} from "@/../bindings/Action.ts";
import {useCallback} from "react";
import {Tone} from "@/../bindings/Tone.ts";
import styles from "@/ui/usb/ConfigEditor/ConfigDialog/edit-switch/EditSwitch.module.css"
import {Button} from "@/shadcn/ui/button.tsx";
import {AudioLines, Keyboard, Mouse, Plus, Trash2} from "lucide-react";
import {Item} from "@/shadcn/ui/item";
import {EditSummerAction} from "@/ui/usb/ConfigEditor/ConfigDialog/edit-switch/EditSummerAction.tsx";
import {Command} from "../../../../../../bindings/Command.ts";
import {
  EditKeyboardAction
} from "@/ui/usb/ConfigEditor/ConfigDialog/edit-switch/EditKeyboardAction/EditKeyboardAction.tsx";
import type {SlimKeyReport} from "../../../../../../bindings/SlimKeyReport";
import {EditMouseAction} from "@/ui/usb/ConfigEditor/ConfigDialog/edit-switch/EditMouseAction.tsx";
import type {MouseReport} from "../../../../../../bindings/MouseReport";

type EditSwitchProps = {
  changeConfig: (config: ConfigOptions) => void,
  config: Action[],
  executeCommand: (command: Command, data: number[], silent: boolean) => Promise<void>
}

export function EditSwitch({changeConfig, config, executeCommand}: EditSwitchProps) {
  const changeAction = useCallback((action: Action, index: number) => {
    const newConfig = [...config];
    newConfig[index] = action;
    changeConfig(newConfig);
  }, [config]);

  const addAction = useCallback((action: Action) => {
    const newConfig = [...config];
    newConfig.push(action);
    changeConfig(newConfig);
  }, [config]);

  const removeAction = useCallback((index: number) => {
    const newConfig = [...config];
    newConfig.splice(index, 1);
    changeConfig(newConfig);
  }, [config]);

  return <div className={styles.container}>
    <div className={styles.actionList}>
      {config.map((item, i) => (
          <Item variant={"outline"} key={`edit-action-${i}`}>
            <EditAction
                action={item}
                changeAction={(action) => changeAction(action, i)}
                removeAction={() => removeAction(i)}
                executeCommand={executeCommand}
            />
          </Item>
      ))}
    </div>

    <div className={styles.row}>
      <Button variant={"outline"} onClick={() => addAction({
        type: 2,
        data: {buttons: 0, pan: 0, wheel: 0, y: 0, x: 0}
      })}>
        <Mouse/>
        <Plus/>
      </Button>

      <Button variant={"outline"} onClick={() => addAction({
        type: 1,
        data: {
          modifier: 0,
          keycodes: [0, 0, 0, 0, 0, 0]
        }
      })}>
        <Keyboard/>
        <Plus/>
      </Button>

      <Button variant={"outline"} onClick={() => addAction({
        type: 3,
        data: Tone.default,
      })}>
        <AudioLines/>
        <Plus/>
      </Button>
    </div>
  </div>;
}

type EditActionProps = {
  action: Action;
  changeAction: (config: Action) => void;
  removeAction: () => void;
  executeCommand: (command: Command, data: number[], silent: boolean) => Promise<void>
};

function EditAction({action, changeAction, removeAction, executeCommand}: EditActionProps) {
  return <div className={styles.row}>
    {action.type === Action.keyAction &&
      <EditKeyboardAction
        action={action.data as SlimKeyReport}
        change={(action) => changeAction({type: 1, data: action})}
      />}

    {action.type === Action.mouseAction &&
      <EditMouseAction
        action={action.data as MouseReport}
        change={(action) => changeAction({type: 2, data: action})}
      />
    }

    {action.type === Action.summerAction &&
      <EditSummerAction
        action={action.data as number}
        change={(action) => changeAction({type: 3, data: action})}
        executeCommand={executeCommand}
      />
    }

    <Button variant={"destructive"} onClick={removeAction}>
      <Trash2/>
    </Button>
  </div>
}