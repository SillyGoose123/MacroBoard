#[macro_export]
macro_rules! count_variants {
    ($($variant:ident),*) => {
        <[()]>::len(&[$(crate::count_variants![@sub $variant]),*])
    };
    (@sub $x:ident) => { () };
}


#[macro_export]
macro_rules! def_enum {
    (
        $(#[$attr:meta])*
        $vis:vis $name:ident => $ty:ty {
            $($variant:ident => $val:expr),+
            $(,)?
        }
    ) => {
        $(#[$attr])*
        $vis enum $name {
          $($variant),+
        }

        impl $name {
          #[allow(unused)]
          pub fn get(&self ) -> $ty {
            match self {
              $(&Self::$variant => $val),+
            }
          }

          #[allow(unused)]
          pub const ALL: [$name; crate::count_variants!($($variant),+)] = [
            $($name::$variant),+
          ];
        }
    }
  }