export class Penalty {
  penalty: string;
  penaltyValue: number;
  issueAmount: number;

  constructor(penalty: string, penaltyValue: number) {
    this.penalty = penalty;
    this.penaltyValue = penaltyValue;
  }
}

export const Penalties: Penalty[] = [
  new Penalty('landingLights', -10),
  new Penalty('taxiSpeed', -30),
  new Penalty('hardLanding', -50),
  new Penalty('noFlaps', -15)
]