export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Manufacturer {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
}

export interface CarColor {
  name: string;
  hex: string;
}

export interface EngineType {
  name: string;
  description: string;
}

export interface Transmission {
  name: string;
  description: string;
}

export const CAR_COLORS: CarColor[] = [
  { name: "Red", hex: "#fc0303" },
  { name: "Green", hex: "#03fc4e" },
  { name: "Blue", hex: "#0331fc" },
  { name: "Yellow", hex: "#fcf403" },
  { name: "Black", hex: "#080808" },
  { name: "White", hex: "#ffffff" }
];

export const ENGINE_TYPES: EngineType[] = [
  { name: "Petrol", description: "This refers to a common type of liquid fuel used in internal combustion engines. It is derived from crude oil through a refining process. Petrol engines ignite a mixture of petrol vapor and air using a spark plug, converting the chemical energy into mechanical power to propel a vehicle. Petrol is known for its relatively high energy density and widespread availability." },
  { name: "Diesel", description: "Another type of liquid fuel derived from crude oil, but with a different refining process than petrol. Diesel engines also use internal combustion but rely on compression ignition. Air is highly compressed in the cylinder, which heats it to a temperature high enough to ignite the injected diesel fuel. Diesel engines are often more fuel-efficient than petrol engines and are known for their higher torque output, making them suitable for larger vehicles and heavy-duty applications." },
  { name: "Electric", description: "This refers to vehicles powered by electric motors rather than internal combustion engines. These vehicles draw energy from rechargeable batteries, which are then used to drive the electric motor(s). Electric vehicles (EVs) produce zero tailpipe emissions, contributing to cleaner air. They offer instant torque, quiet operation, and can be charged at home or at public charging stations." },
  { name: "Hybrid", description: "This category encompasses vehicles that combine two or more sources of power, most commonly an internal combustion engine (either petrol or diesel) with one or more electric motors and a battery. The electric component can assist the engine, improve fuel efficiency, and sometimes allow for short periods of electric-only driving. Different types of hybrids exist, including mild hybrids, full hybrids, and plug-in hybrids (PHEVs), each with varying levels of electric driving capability." }
];

export const TRANSMISSIONS: Transmission[] = [
  { name: "Automatic", description: "A transmission that shifts gears automatically without requiring driver input." },
  { name: "Manual", description: "A transmission where the driver must manually change gears using a clutch and gear lever." },
  { name: "Semi-Automatic", description: "A transmission that allows the driver to manually select gears but without a clutch pedal; gear changes are often electronically assisted." }
]; 