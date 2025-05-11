export const CAR_MODELS: Record<string, string[]> = {
  Tesla: ["Model X", "Model S", "Model 3", "Model Y", "Cybertruck"],
  BMW: ["i3", "i4", "i8", "M4", "X5"],
  Audi: ["A3", "A4", "Q7", "Q5", "e-tron"],
  Mercedes: ["A-Class", "C-Class", "E-Class", "S-Class", "GLC"],
  Ford: ["Mustang", "F-150", "Explorer", "Focus", "Bronco"],
  Toyota: ["Camry", "Corolla", "Highlander", "RAV4", "Prius"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
  Chevrolet: ["Malibu", "Impala", "Tahoe", "Silverado", "Bolt EV"],
  Volkswagen: ["Golf", "Passat", "Tiguan", "ID.4", "Beetle"],
  Nissan: ["Altima", "Maxima", "370Z", "Leaf", "Rogue"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona"],
} as const;

export const CAR_BRANDS = Object.keys(CAR_MODELS);
