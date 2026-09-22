// Stores in flash so writes cycles are a problem (100k)

use crate::bytes_trait::BytesConvert;
use alloc::vec;
use alloc::vec::Vec;
use embassy_rp::flash::{Async, Error, Flash};
use embassy_rp::interrupt::typelevel::{Binding, DMA_IRQ_0};
use embassy_rp::peripherals::{DMA_CH0, FLASH};
use embassy_rp::{Peri, dma};

const START_ADDRESS: u32 = 0x10000100;
const FLASH_SIZE: usize = 2_096_640; // bytes hahah => 2mb
const SECTORS: usize = 10; // more possible but performance
const MIN_ERASE: usize = 1000;
const SECTOR_SIZE: usize = MIN_ERASE; // Config max size is 31,369 bytes (approximately)

pub struct Storage {
    flash: Flash<'static, FLASH, Async, FLASH_SIZE>,
    new_write_sector: Option<usize>,
}
impl Storage {
    pub fn init(
        peri_flash: Peri<'static, FLASH>,
        peri_channel: Peri<'static, DMA_CH0>,
        irq: impl Binding<DMA_IRQ_0, dma::InterruptHandler<DMA_CH0>> + 'static,
    ) -> Self {
        Self {
            flash: Flash::new(peri_flash, peri_channel, irq),
            new_write_sector: None,
        }
    }

    pub async fn read(&mut self) -> Result<Vec<u8>, Error> {
        let mut result = vec![];
        for sector in 0..SECTORS {
            let mut data = [0u32; SECTOR_SIZE];
            self.flash
                .background_read(get_sector_address(sector), &mut data)?
                .await;

            if data[0] == 0 && sector == 0 {
                self.new_write_sector = None;
                return Err(Error::Other); //No data
            }

            if data[0] == 0 {
                self.new_write_sector = Some(sector);
                return Ok(result);
            }

            result = data.to_bytes();
        }

        self.new_write_sector = Some(0);
        Ok(result)
    }

    //write is blocking
    pub fn write(&mut self, data: &[u8]) -> Result<(), Error> {
        let index = self.new_write_sector.unwrap_or(0);
        if self.new_write_sector.is_some() {
            self.flash.blocking_erase(
                get_sector_address(index),
                get_sector_address(index) + SECTOR_SIZE as u32,
            )?;

            let second = if index == SECTORS - 1 { 0 } else { index + 1 };
            self.flash.blocking_erase(
                get_sector_address(second),
                get_sector_address(second) + SECTOR_SIZE as u32,
            )?;
        }

        self.flash.blocking_write(get_sector_address(index), data)?;
        Ok(())
    }
}

fn get_sector_address(sector: usize) -> u32 {
    START_ADDRESS + (SECTOR_SIZE * sector) as u32
}
