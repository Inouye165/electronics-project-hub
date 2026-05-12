import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: "workbench@example.local" },
    update: {},
    create: {
      email: "workbench@example.local",
      name: "Workbench Owner",
    },
  });

  await prisma.project.upsert({
    where: { slug: "bench-led-continuity-tester" },
    update: {},
    create: {
      ownerId: owner.id,
      title: "Bench LED Continuity Tester",
      slug: "bench-led-continuity-tester",
      shortDescription: "A small battery-powered continuity tester with a bright LED and current-limiting resistor.",
      projectGoal: "Build a reliable tester that quickly shows whether a wire, switch, or solder joint has continuity without reaching for a multimeter every time.",
      whyBuilt: "I wanted a simple tool that could live on the bench and help me check wiring while both hands were busy with clips and probes.",
      problemSolved: "A multimeter works well, but it is slower to set up during a build. This tester gives an immediate visual answer while keeping current low enough for small circuits.",
      status: "building",
      difficulty: "beginner",
      projectStory: "The project started after chasing a bad solder joint on a small LED strip. I kept switching the meter between voltage and continuity, then decided the bench needed a dedicated tester. The first version is intentionally simple: battery, resistor, LED, switch, and probes.",
      partsSummary: "Coin cell holder, red LED, 1 kOhm resistor, small slide switch, two probe leads, heat shrink, and a small printed or repurposed enclosure.",
      lessonsLearned: "A basic tool is easier to trust when the current path is obvious. Labeling the probe polarity also helps later when checking diodes or LEDs.",
      mistakesProblems: "The first resistor choice made the LED too dim in normal room light. The first probe wire was also too stiff and kept pulling the enclosure around.",
      fixesSolutions: "I tested resistor values on a breadboard, settled on a brighter LED, and switched to softer silicone wire for the probes.",
      safetyNotes: "Only use this tester on unpowered circuits. It has its own battery and is not designed to touch mains voltage or charged capacitors.",
      futureTutorialNotes: "Show the current path with a simple diagram, then demonstrate the tester on a good wire, a broken wire, and a switch.",
      nextSteps: "Mount the parts in the enclosure, add strain relief for the probe wires, and document the final resistor value after brightness testing.",
      steps: {
        create: [
          {
            stepNumber: 1,
            title: "Prove the circuit on a breadboard",
            simpleExplanation: "The LED lights when the two probes touch through a connected path.",
            partsToolsNeeded: "Breadboard, LED, resistor assortment, coin cell holder, jumper wires, and two temporary probe leads.",
            whatIDid: "I built the LED and resistor in series with the battery and used two jumper wires as the probes.",
            whatWentWrong: "The first resistor value made the LED hard to see under the desk lamp.",
            howIFixedIt: "I compared nearby resistor values and picked the one that stayed bright while keeping current low.",
            grandkidFriendlyExplanation: "Electricity needs a complete loop. When the probes find a good path, the loop closes and the light turns on.",
            futureTutorialNotes: "Film the breadboard from above and point to each part while the LED turns on and off.",
            safetyNotes: "Keep the test circuit separate from powered projects while experimenting.",
          },
          {
            stepNumber: 2,
            title: "Choose probe wire and enclosure layout",
            simpleExplanation: "The tester needs flexible wires and a body that is comfortable to hold.",
            partsToolsNeeded: "Silicone wire, enclosure, drill bits, switch, LED bezel, and heat shrink.",
            whatIDid: "I laid out the LED, switch, and wire exits before drilling so the probes would not twist around the case.",
            whatWentWrong: "The first wire I tried was too stiff and moved the whole tester when I touched the probe tips together.",
            howIFixedIt: "I changed to softer wire and planned a small knot inside the enclosure for strain relief.",
            grandkidFriendlyExplanation: "A good tool should not fight your hands. Soft wires make it easier to touch tiny parts carefully.",
            futureTutorialNotes: "Show both wire types side by side so the difference is obvious.",
            safetyNotes: "Deburr drilled holes so sharp plastic does not cut the wire insulation.",
          },
        ],
      },
      parts: {
        create: [
          { name: "Red LED", quantity: 1, role: "Visual continuity indicator" },
          { name: "1 kOhm resistor", quantity: 1, role: "Limits current through the LED" },
          { name: "Silicone probe wire", quantity: 2, role: "Flexible probe leads" },
        ],
      },
      referenceLinks: {
        create: [
          {
            label: "LED current limiting resistor refresher",
            url: "https://learn.sparkfun.com/tutorials/light-emitting-diodes-leds/all",
            sourceName: "SparkFun",
            notes: "Useful explanation for resistor sizing and LED polarity.",
          },
        ],
      },
    },
  });

  await prisma.inventoryItem.upsert({
    where: { id: "seed-led-red-5mm" },
    update: {},
    create: {
      id: "seed-led-red-5mm",
      name: "5 mm red LEDs",
      category: "Indicators",
      manufacturer: "Assorted",
      quantityOnHand: 24,
      storageLocation: "Drawer A2",
      status: "available",
      notes: "Used for simple status indicators and beginner-friendly demonstrations.",
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "label-polarity-before-closing-enclosures" },
    update: {},
    create: {
      title: "Label polarity before closing enclosures",
      slug: "label-polarity-before-closing-enclosures",
      type: "mistake",
      summary: "Once a project is closed, polarity markings save future troubleshooting time.",
      body: "Add small polarity marks near power leads, LED legs, and connector pins before the final assembly photos. Future repairs are easier when the orientation is visible without reopening old notes.",
      tags: ["assembly", "documentation", "troubleshooting"],
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
