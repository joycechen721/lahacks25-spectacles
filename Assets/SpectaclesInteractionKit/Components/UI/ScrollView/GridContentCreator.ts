import { ScrollView } from "./ScrollView";

// Define the structure
interface CookingStep {
  step: number;
  title: string;
  start_time: number;
  end_time: number;
  text: string;
}

// Store the data
const beefWellingtonSteps: CookingStep[] = [
{
  step: 1,
  title: "Introduction to Beef Wellington",
  start_time: 0,
  end_time: 30,
  text: "Learn about the history and popularity of Beef Wellington, a celebratory dish often enjoyed at Christmas. The video will walk through each step needed to perfect this iconic recipe. Get ready for a breakdown of all major components to ensure success."
},
{
  step: 2,
  title: "Making the Mushroom Duxelle",
  start_time: 30,
  end_time: 158,
  text: "Blitz all the mushrooms in a blender until finely chopped, working in batches to avoid overcrowding. Cook the chopped mushrooms in a large pan with olive oil and salt for about 20–30 minutes until nearly all the moisture evaporates. Stir in minced garlic and thyme, optionally deglaze with whiskey, flambe if desired, and cook further until the mixture is dry, rich, and fragrant."
},
{
  step: 3,
  title: "Making the Herb Crepes",
  start_time: 158,
  end_time: 245,
  text: "Blanch parsley, spinach, and chives briefly in boiling water, then shock them in ice water to preserve their bright green color. Blend the blanched herbs with milk until smooth, then mix into a crepe batter with eggs, butter, flour, and salt. Cook thin crepes on a lightly oiled pan until set on both sides, then set aside to cool completely."
},
{
  step: 4,
  title: "Making the Puff Pastry",
  start_time: 245,
  end_time: 393,
  text: "Prepare a basic dough by rubbing cold butter into flour and salt until sandy, then gradually mix with cold water. Chill the dough, then prepare a butter block by blending room-temperature butter with flour and shaping it into a square. Enclose the butter block with the dough, roll out, fold like a letter, and repeat multiple times with resting periods to build flaky pastry layers."
},
{
  step: 5,
  title: "Preparing the Beef Fillet",
  start_time: 393,
  end_time: 480,
  text: "Dry brine a center-cut beef fillet by seasoning it heavily with salt and refrigerating uncovered overnight. Sear the beef fillet briefly on all sides in a hot pan to achieve a golden crust. Brush the seared beef with Dijon mustard and tightly wrap it in cling film before chilling it to firm up."
},
{
  step: 6,
  title: "Assembling the Wellington",
  start_time: 480,
  end_time: 550,
  text: "Lay out herb crepes on cling film, overlapping slightly, then layer prosciutto slices to form a moisture barrier. Spread the cooled mushroom duxelle evenly over the prosciutto. Place the chilled beef fillet on top and roll everything tightly into a uniform log, sealing the edges, and chill again to maintain the shape."
},
{
  step: 7,
  title: "Wrapping in Puff Pastry",
  start_time: 550,
  end_time: 580,
  text: "Roll out the puff pastry to a quarter-inch thickness and brush with beaten egg. Unwrap the beef roll and place it at the edge of the pastry, rolling it up tightly and trimming excess pastry for a neat seam. Optionally, decorate the Wellington with a lattice of pastry on top and brush again with egg wash."
},
{
  step: 8,
  title: "Baking the Wellington",
  start_time: 580,
  end_time: 600,
  text: "Bake the Wellington in a preheated oven until the internal temperature of the beef reaches 43°C (109°F) for a perfect medium-rare. Depending on the oven and size of the beef, this will take around 40–45 minutes. Allow the Wellington to rest for at least 10 minutes after baking to set the juices."
},
{
  step: 9,
  title: "Making the Red Wine Sauce",
  start_time: 600,
  end_time: 640,
  text: "Roast bone marrow in the oven until soft, then scrape it into a saucepan. Add shallots, beef stock, red wine, and a sprig of rosemary, and simmer to reduce until thick and glossy. Finish by whisking in cold butter to make the sauce silky and rich."
},
{
  step: 10,
  title: "Serving the Beef Wellington",
  start_time: 640,
  end_time: 667,
  text: "Carve the rested Wellington carefully into thick slices, revealing the distinct layers of pastry, mushroom duxelle, and perfectly cooked beef. Spoon over the rich red wine sauce and garnish with chopped chives if desired. Serve immediately and enjoy the delicious results."
}
];

/**
 * This class is responsible for creating and positioning grid content items based on a specified prefab and item count. It instantiates the items and arranges them vertically with a specified offset.
 */
@component
export class GridContentCreator extends BaseScriptComponent {
  offsets: number[];
  curInstr: number = 0;

  physicallyScroll(): void {
    const scrollView = this.getSceneObject().getParent().getComponent(ScrollView.getTypeName())

    // NOTE only scroll once offset has passed (to simulate centering)

    const {x, y, z} = scrollView.contentPosition

    /* 20 is half of 40, which is the height of the scrollable container */
    scrollView.contentPosition = new vec3(x, Math.max(0, this.offsets[this.curInstr] - 12), z)
  }

  scrollToPrevInstruction(): void {
    if (this.curInstr - 1 < 0) {
      return
    }

    // re-render the changed colors
    const oldCurInstr = this.getSceneObject().getChild(this.curInstr)
    this.curInstr--;
    const newCurInstr = this.getSceneObject().getChild(this.curInstr)
    oldCurInstr.getComponent("Component.Text").textFill.color = new vec4(1, 1, 1, 0.6)
    newCurInstr.getComponent("Component.Text").textFill.color = new vec4(1, 1, 1, 1)

    this.physicallyScroll()
}

  scrollToNextInstruction(): void {
    if (this.curInstr + 1 >= this.offsets.length) {
      return
    }

    // re-render the changed colors
    const oldCurInstr = this.getSceneObject().getChild(this.curInstr)
    this.curInstr++;
    const newCurInstr = this.getSceneObject().getChild(this.curInstr)
    oldCurInstr.getComponent("Component.Text").textFill.color = new vec4(1, 1, 1, 0.6)
    newCurInstr.getComponent("Component.Text").textFill.color = new vec4(1, 1, 1, 1)
    
    this.physicallyScroll()
  }

  onAwake(): void {
    this.offsets = [];

    const instructions = beefWellingtonSteps

    let nextOffset = 0

    // TODO create text stub
    for (let i = 0; i < instructions.length; i++) {
      this.offsets.push(nextOffset);

      const stepNumber = i + 1

      const { text: instruction } = instructions[i];
      // const numLines = 4

      const firstChild = this.getSceneObject().getChild(0)

      // the firstChild is a dummy text node
      // so replace it for the first child
      // and otherwise create a new child
      let target = firstChild
      if (i != 0) {
        target = this.getSceneObject().copySceneObject(firstChild)
      }
      
      // for purposes of rendering, estimate how many lines the previous
      // recipe step was
      const numLines = Math.ceil(instructions[i].text.length / 65)

      const screenTransform = target.getComponent("Component.ScreenTransform")


      screenTransform.offsets.setCenter(new vec2(0, -nextOffset))

      nextOffset += numLines * 1.5

      const text = target.getComponent("Component.Text")
      text.text = `${stepNumber}. ${instruction}`
      if (i == this.curInstr) {
        text.textFill.color = new vec4(1, 1, 1, 1);
      } else {
        text.textFill.color = new vec4(0.6, 0.6, 0.6, 1);
      }

      target.enabled = true
    }
  }
}
