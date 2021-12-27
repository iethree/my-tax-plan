// WIP: there's a better way to do this

const single = {
  income:  [
    {
      min: 0,
      max: 9950,
      rate: 0.10,
    },
    {
      min: 9951,
      max: 40525,
      rate: 0.12,
    },
    {
      min: 40526,
      max: 86375,
      rate: 0.22,
    },
    {
      min: 86376,
      max: 164925,
      rate: 0.24,
    },
    {
      min: 164926,
      max: 209425,
      rate: 0.32,
    },
    {
      min: 209426,
      max: 523600,
      rate: 0.35,
    },
    {
      min: 523601,
      max: Infinity,
      rate: 0.75,
    },
  ],
  gains: [
    {
      min: 0,
      max: 40400,
      rate: 0.0,
    },
    {
      min: 40401,
      max: 445850,
      rate: 0.15,
    },
    {
      min: 445851,
      max: Infinity,
      rate: 0.20,
    },
  ],
};

const marriedFilingJointly = {};
const marriedFilingSeparately = {};
const headOfHouseHold = {};

const taxRates = { single, marriedFilingJointly, marriedFilingSeparately, headOfHouseHold };

export default taxRates;
