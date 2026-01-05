#[macro_export]
macro_rules! count_variants {
    ($($variant:ident),*) => {
        <[()]>::len(&[$(crate::count_variants![@sub $variant]),*])
    };
    (@sub $x:ident) => { () };
}

#[macro_export]
macro_rules! def_enum_all {
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

#[macro_export]
macro_rules! mk_static {
    // mutable version
    ($name:ident : mut $type:ty = $value:expr) => {
        let $name: &'static mut $type = alloc::boxed::Box::leak(alloc::boxed::Box::new($value));
    };
    // immutable version
    ($name:ident : $type:ty = $value:expr) => {
        let $name: &'static $type = alloc::boxed::Box::leak(alloc::boxed::Box::new($value));
    };
}