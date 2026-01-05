use crate::CONFIG;
use crate::key::key_action::execute_actions;
use embassy_executor::{Spawner, task};
use embassy_rp::gpio::Input;

#[task]
async fn switch_check(index: usize, mut input: Input<'static>) {
    loop {
        input.wait_for_high().await;
        let cfg = CONFIG.lock().await;
        execute_actions(&cfg.as_ref().unwrap().switch_action[index]).await;
    }
}

pub fn init_switches(spawner: Spawner, inputs: [Input<'static>; 6]) {
    for (index, input) in inputs.into_iter().enumerate() {
        spawner.spawn(switch_check(index, input)).unwrap();
    }
}
