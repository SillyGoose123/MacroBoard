pub enum Tone {
  LOW,
  MEDIUM,
  DEFAULT,
  HIGH
}

impl Tone {
  pub(crate) fn get_value(&self) -> u16 {
    match self {
      Tone::LOW => 1000,
      Tone::MEDIUM => 2000,
      Tone::DEFAULT => 4000,
      Tone::HIGH => 8000,
    }
  }
}