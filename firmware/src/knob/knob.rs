use crate::CONFIG;
use crate::key::key_action::execute_actions;
use embassy_executor::{Spawner, task};
use embassy_rp::gpio::Input;

#[task]
async fn knob_switch(mut input: Input<'static>) {
    loop {
        input.wait_for_high().await;
        let cfg = CONFIG.lock().await;
        execute_actions(&cfg.as_ref().unwrap().knob_action.switch).await;
    }
}

#[task]
async fn knob_rotary(mut rotary_pins: [Input<'static>; 2]) {
    loop {
        rotary_pins[0].wait_for_rising_edge().await;
        let cfg = CONFIG.lock().await;
        let rotary_action = cfg.as_ref().unwrap();

        let action = if rotary_pins[1].is_low() {
            &rotary_action.knob_action.rotary_action.minus
        } else {
            &rotary_action.knob_action.rotary_action.plus
        };
        execute_actions(action).await;
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
