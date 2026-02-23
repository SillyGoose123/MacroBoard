use crate::CONFIG;
use crate::key::key_action::execute_actions;
use embassy_executor::{Spawner, task};
use embassy_rp::gpio::Input;

#[task(pool_size = 6)]
async fn switch_check(index: usize, mut input: Input<'static>) {
    loop {
        input.wait_for_high().await;
        let actions = {
            CONFIG
                .lock()
                .await
                .as_ref()
                .expect("Config not initialised at switch task!")
                .switch_action[index]
                .clone()
        };
        execute_actions(&actions).await;
    }
}

pub fn init_switches(spawner: Spawner, inputs: [Input<'static>; 6]) {
    for (index, input) in inputs.into_iter().enumerate() {
        spawner.spawn(switch_check(index, input)).unwrap();
    }
}
