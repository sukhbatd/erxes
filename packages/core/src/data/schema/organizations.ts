// export const types = `
//   type ChargePrice {
//     monthly: Float
//     yearly: Float
//     oneTime: Float
//   }

//   type ChargeUsage {
//     totalAmount: Float
//     purchasedAmount: Float
//     freeAmount: Float
//     promoCodeAmount: Float
//     remainingAmount: Float
//     usedAmount: Float
//   }

//   type ChargeItem {
//     name: String
//     type: String
//     initialCount: Int
//     growthInitialCount: Int
//     count: Int
//     price: ChargePrice
//     description: String
//     unit: String
//     comingSoon: Boolean

//     usage: ChargeUsage
//     title: String
//   }
// `;

export const queries = `
    getOnboardingSteps: [String]
`;

export const mutations = `
    organizationOnboardingDone: JSON
`;

// export const mutations = `
//     forgotPassword(email: String!): String!
// `;
