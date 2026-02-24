use crate::CONFIG;
use crate::key::key_action::execute_actions;
use embassy_executor::{Spawner, task};
use embassy_rp::gpio::Input;

#[task]
async fn knob_switch(mut input: Input<'static>) {
    loop {
        input.wait_for_high().await;
        let action = {
            CONFIG
                .lock()
                .await
                .as_ref()
                .expect("Config not initialised at knob task!")
                .knob_action
                .switch
                .clone()
        };
        execute_actions(&action).await;
        input.wait_for_low().await;
    }
}

#[task]
async fn knob_rotary(mut rotary_pins: [Input<'static>; 2]) {
    loop {
        rotary_pins[0].wait_for_rising_edge().await;
        let action = {
            CONFIG
                .lock()
                .await
                .as_ref()
                .expect("Config not initialised at knob task!")
                .knob_action
                .rotary_action
                .clone()
        };
        let actions = if rotary_pins[1].is_low() {
            &action.minus
        } else {
            &action.plus
        };
        execute_actions(actions).await;
        rotary_pins[0].wait_for_falling_edge().await;
    }
}

pub fn init_knob(spawner: Spawner, switch_pin: Input<'static>, rotary_pins: [Input<'static>; 2]) {
    spawner
        .spawn(knob_switch(switch_pin))
        .expect("Failed to init knob.");
    spawner
        .spawn(knob_rotary(rotary_pins))
        .expect("Failed to init knob.");
}
