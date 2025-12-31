use cortex_m::prelude::{_embedded_hal_PwmPin, _embedded_hal_timer_CountDown};
use seeeduino_xiao_rp2040::hal::fugit::ExtU32;
use seeeduino_xiao_rp2040::hal::gpio::{FunctionPwm, Pin, PullDown};
use seeeduino_xiao_rp2040::hal::gpio::bank0::Gpio7;
use seeeduino_xiao_rp2040::hal::pwm::{FreeRunning, Pwm3, Slice, Slices};
use seeeduino_xiao_rp2040::hal::Timer;
use seeeduino_xiao_rp2040::hal::timer::CountDown;
use crate::summer::tones::Tone;

pub struct Summer<'a> {
  countdown: CountDown<'a>,
  slice: Slice<Pwm3, FreeRunning>,
}

impl<'a> Summer<'a> {
  pub fn init(pin: Pin<Gpio7, FunctionPwm, PullDown>, timer: &'a Timer, pwm_slices: Slices) -> Self {
    let mut slice = pwm_slices.pwm3;
    slice.set_ph_correct();
    slice.enable();
    slice.channel_b.output_to(pin);

    Self {
      countdown: timer.count_down(),
      slice,
    }
  }

  pub fn summ(&mut self, duration: u32, tone: Tone) {
    let top = tone.get_value();
    self.slice.set_top(top);
    self.slice.channel_b.set_duty(top / 2);
    self.countdown.start(duration.millis());
  }

  pub fn tick(&mut self) {
    if self.countdown.wait().is_ok() {
      self.slice.channel_b.set_duty(0);
    }
  }
}