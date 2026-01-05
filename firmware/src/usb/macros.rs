#[macro_export]
macro_rules! byte_enum {
  (
    $vis:vis enum $name:ident {
    $($variant:ident = $val:expr),+,
  }) => {
    use core::result::Result;
    use core::result::Result::{Ok, Err};

    #[repr(u8)]
    #[derive(TsBind)]
    $vis enum $name {
      $($variant),+
    }

    impl $name {
      fn from_bytes(data: u8) -> Result<Self, ()> {
        match data {
          $($val => Ok(Self::$variant)),+,
          _=> Err(())
        }
      }
    }
  }
}