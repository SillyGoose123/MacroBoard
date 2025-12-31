use crate::led::effect::{Effect, Effects};
use cortex_m::prelude::_embedded_hal_timer_CountDown;
use seeeduino_xiao_rp2040::hal::fugit::ExtU32;
use seeeduino_xiao_rp2040::hal::gpio::bank0::Gpio6;
use seeeduino_xiao_rp2040::hal::gpio::{FunctionPio0, Pin, PullDown};
use seeeduino_xiao_rp2040::hal::pio::SM0;
use seeeduino_xiao_rp2040::hal::timer::CountDown;
use seeeduino_xiao_rp2040::hal::Timer;
use seeeduino_xiao_rp2040::pac::PIO0;
use smart_leds_trait::SmartLedsWrite;
use ws2812_pio::Ws2812Direct;

pub struct Led<'a> {
    ws: Ws2812Direct<PIO0, SM0, Pin<Gpio6, FunctionPio0, PullDown>>,
    countdown: CountDown<'a>,
    effect: Effect,
}

impl<'a> Led<'a> {
    pub fn init(
        ws: Ws2812Direct<PIO0, SM0, Pin<Gpio6, FunctionPio0, PullDown>>,
        timer: &'a Timer,
    ) -> Self {
        let mut countdown = timer.count_down();
        countdown.start(1.millis());
        Self { ws, countdown, effect: Effects::Off.get() }
    }

    pub fn next_effect(&mut self) {
      let _idx = Effects::ALL.iter()
        .position(|x| x.get() == self.effect);
    }

    pub fn tick(&mut self) {
      //only write at least 60 micros
      if !self.countdown.wait().is_ok() {
        return;
      }

      //check effect
      self.ws.write([self.effect.tick()].iter().copied()).expect("Writing color failed.");
    }
}
