import { Flashcard } from '../store/useStore';

export const PHYSICS_FLASHCARDS: Flashcard[] = [
  // Chapter 23: Electric Fields
  {
    question: "What type of charge do electrons possess?",
    answer: "Negative",
    options: ["Positive", "Negative", "Neutral", "Variable"]
  },
  {
    question: "According to the properties of electric charges, what happens between like charges?",
    answer: "They repel each other",
    options: ["They attract each other", "They repel each other", "They cancel each other", "Nothing happens"]
  },
  {
    question: "Which particle carries a positive electric charge?",
    answer: "Proton",
    options: ["Electron", "Neutron", "Proton", "Photon"]
  },
  {
    question: "What is the phenomenon where electric charge is neither created nor destroyed in an isolated system?",
    answer: "Conservation of charge",
    options: ["Quantization of charge", "Conservation of charge", "Transfer of charge", "Induction of charge"]
  },
  {
    question: "A glass rod rubbed with silk becomes _____ charged.",
    answer: "Positively",
    options: ["Negatively", "Positively", "Neutrally", "Magnetically"]
  },
  {
    question: "What does the formula q = ±Ne represent?",
    answer: "Quantization of electric charge",
    options: ["Coulomb's Law", "Electric Field strength", "Quantization of electric charge", "Newton's Second Law"]
  },
  {
    question: "What is the fundamental unit of charge (e)?",
    answer: "1.6 × 10⁻¹⁹ C",
    options: ["1.6 × 10⁻¹⁹ C", "9.11 × 10⁻³¹ C", "8.85 × 10⁻¹² C", "6.24 × 10¹⁸ C"]
  },
  {
    question: "Materials in which some electrons can move relatively freely are called:",
    answer: "Conductors",
    options: ["Insulators", "Semiconductors", "Conductors", "Dielectrics"]
  },
  {
    question: "Which of these is a typical example of an electrical insulator?",
    answer: "Rubber",
    options: ["Copper", "Silver", "Aluminum", "Rubber"]
  },
  {
    question: "Charging an object without physical contact is known as:",
    answer: "Induction",
    options: ["Conduction", "Friction", "Induction", "Polarization"]
  },
  {
    question: "What is a 'point charge'?",
    answer: "A particle of zero size that carries electric charge",
    options: ["A large sphere of charge", "A particle of zero size that carries electric charge", "A proton", "A charged wire"]
  },
  {
    question: "Coulomb's Law states that the electric force is inversely proportional to:",
    answer: "The square of the separation distance",
    options: ["The separation distance", "The product of charges", "The square of the separation distance", "The mass of particles"]
  },
  {
    question: "What is the value of the Coulomb constant (ke)?",
    answer: "8.99 × 10⁹ N·m²/C²",
    options: ["8.85 × 10⁻¹² N·m²/C²", "8.99 × 10⁹ N·m²/C²", "6.67 × 10⁻¹¹ N·m²/C²", "1.6 × 10⁻¹⁹ N·m²/C²"]
  },
  {
    question: "Which law states that the force on q1 is equal in magnitude and opposite in direction to the force on q2?",
    answer: "Newton's Third Law",
    options: ["Newton's Second Law", "Coulomb's Law", "Newton's Third Law", "Gauss's Law"]
  },
  {
    question: "The vector sum of forces exerted by individual charges on a single charge is the:",
    answer: "Superposition Principle",
    options: ["Equilibrium Principle", "Superposition Principle", "Action-Reaction Principle", "Gauss Principle"]
  },
  {
    question: "What is the definition of an electric field (E)?",
    answer: "The electric force per unit charge",
    options: ["The total electric force", "The electric force per unit charge", "The work done per charge", "The charge density"]
  },
  {
    question: "What is the SI unit for the electric field?",
    answer: "N/C",
    options: ["C/N", "N/C", "V·m", "J/C"]
  },
  {
    question: "Electric field lines from a positive source charge point:",
    answer: "Outward, away from the charge",
    options: ["Inward, toward the charge", "Outward, away from the charge", "In a circular path", "Vertically upward only"]
  },
  {
    question: "For a negative test charge, the electric force is _____ the direction of the electric field.",
    answer: "Opposite to",
    options: ["In same direction as", "Opposite to", "Perpendicular to", "Independent of"]
  },
  {
    question: "What is the linear charge density formula?",
    answer: "λ = Q / ℓ",
    options: ["ρ = Q / V", "σ = Q / A", "λ = Q / ℓ", "E = F / q"]
  },
  {
    question: "Electric field lines are ALWAYS _____ to the electric field vector at each point.",
    answer: "Tangent",
    options: ["Perpendicular", "Parallel", "Tangent", "Opposite"]
  },
  {
    question: "Can two electric field lines ever cross?",
    answer: "No",
    options: ["Yes", "No", "Only for opposite charges", "Only inside a conductor"]
  },
  {
    question: "In a uniform electric field, the acceleration of a charged particle is:",
    answer: "Constant",
    options: ["Zero", "Increasing", "Decreasing", "Constant"]
  },
  {
    question: "What is the acceleration formula for a particle of mass m and charge q in field E?",
    answer: "a = qE / m",
    options: ["a = F / m", "a = qE / m", "a = E / q", "a = m / qE"]
  },
  {
    question: "An electron projected horizontally into a vertical uniform electric field follows a _____ path.",
    answer: "Parabolic",
    options: ["Linear", "Circular", "Parabolic", "Hyperbolic"]
  },

  // Chapter 24: Gauss's Law
  {
    question: "What is electric flux (ΦE)?",
    answer: "Product of E and perpendicular surface area",
    options: ["Force per unit area", "Density of charge", "Product of E and perpendicular surface area", "Velocity of charges"]
  },
  {
    question: "The electric flux is proportional to the number of _____ penetrating a surface.",
    answer: "Electric field lines",
    options: ["Electrons", "Protons", "Electric field lines", "Magnetic lines"]
  },
  {
    question: "Electric flux is MAXIMUM when the surface is _____ to the field.",
    answer: "Perpendicular",
    options: ["Parallel", "Perpendicular", "At 45 degrees", "Curved"]
  },
  {
    question: "What is the SI unit for electric flux?",
    answer: "N·m²/C",
    options: ["C/N", "N·C/m²", "N·m²/C", "V/m"]
  },
  {
    question: "Gauss's Law relates the net electric flux through a closed surface to the:",
    answer: "Net enclosed charge",
    options: ["Total area", "Total mass", "Net enclosed charge", "Strength of E"]
  },
  {
    question: "The closed surface used in Gauss's Law is called a:",
    answer: "Gaussian surface",
    options: ["Faraday surface", "Gaussian surface", "Equipotential surface", "Flux surface"]
  },
  {
    question: "If net charge inside a Gaussian surface is zero, the net flux is:",
    answer: "Zero",
    options: ["Maximum", "Infinite", "Zero", "Kept constant"]
  },
  {
    question: "Net flux through a closed surface depends ONLY on:",
    answer: "Charge enclosed",
    options: ["Shape of the surface", "Charge enclosed", "Size of the surface", "External charges"]
  },
  {
    question: "Doubling the radius of a Gaussian sphere around a charge changes the flux by:",
    answer: "Nothing (Flux remains same)",
    options: ["Doubling it", "Halving it", "Nothing (Flux remains same)", "Quadrupling it"]
  },
  {
    question: "Which symbol represents the permittivity of free space?",
    answer: "ε₀",
    options: ["ke", "λ", "σ", "ε₀"]
  },
  {
    question: "What is the electric field inside a conductor in electrostatic equilibrium?",
    answer: "Zero",
    options: ["Maximum", "Uniform", "Zero", "Kept constant"]
  },
  {
    question: "In a conductor, any net charge resides entirely:",
    answer: "On the surface",
    options: ["At the center", "Uniformly throughout", "On the surface", "Inside atoms"]
  },
  {
    question: "Electric field just outside a charged conductor is always _____ to the surface.",
    answer: "Perpendicular",
    options: ["Parallel", "Perpendicular", "At 45 degrees", "Tangent"]
  },
  {
    question: "Where is the surface charge density greatest on an irregularly shaped conductor?",
    answer: "Where radius of curvature is smallest",
    options: ["Where radius of curvature is largest", "At the flat parts", "Where radius of curvature is smallest", "At the center"]
  },
  {
    question: "What is the electric field formula outside a charged conductor?",
    answer: "E = σ / ε₀",
    options: ["E = σ / 2ε₀", "E = σ / ε₀", "E = λ / ε₀", "E = zero"]
  },
  {
    question: "The electric field of an infinite plane of charge is:",
    answer: "E = σ / (2ε₀)",
    options: ["E = σ / ε₀", "E = σ / (2ε₀)", "E = ke Q / r²", "E = λ / r"]
  },
  {
    question: "According to Gauss's Law, flux (ΦE) is equal to:",
    answer: "qin / ε₀",
    options: ["ke Q / r²", "qin / ε₀", "EA sin θ", "F / q"]
  },
  {
    question: "Silicon and Germanium are examples of:",
    answer: "Semiconductors",
    options: ["Conductors", "Insulators", "Semiconductors", "Superconductors"]
  },
  {
    question: "A process similar to induction that takes place in insulators is called:",
    answer: "Charge rearrangement (Polarization)",
    options: ["Conduction", "Charge rearrangement (Polarization)", "Radiation", "Quantization"]
  },
  {
    question: "1 Coulomb (C) of charge is equivalent to how many protons?",
    answer: "6.24 × 10¹⁸",
    options: ["1.6 × 10⁻¹⁹", "6.24 × 10¹⁸", "8.99 × 10⁹", "9.11 × 10⁻³¹"]
  },
  {
    question: "What is the surface charge density formula?",
    answer: "σ = Q / A",
    options: ["λ = Q / ℓ", "σ = Q / A", "ρ = Q / V", "Φ = EA"]
  },
  {
    question: "The electric field inside a solid insulating sphere with total charge Q grows _____ with r.",
    answer: "Linearly",
    options: ["Inversely", "Linearly", "Quadratically", "Exponentially"]
  },
  {
    question: "Which of the following is a conservative force?",
    answer: "Electric force",
    options: ["Friction", "Electric force", "Air resistance", "Tension"]
  },
  {
    question: "If a Gaussian surface surrounds no charge, the electric field at every point on the surface _____ be zero.",
    answer: "Need not",
    options: ["Must", "Need not", "Is always", "Is never"]
  },
  {
    question: "The term used for a mathematical closed surface in Gauss's Law is:",
    answer: "Gaussian surface",
    options: ["Boundary surface", "Gaussian surface", "Field surface", "Limit surface"]
  }
];
