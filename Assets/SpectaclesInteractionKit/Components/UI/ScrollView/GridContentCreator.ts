/**
 * This class is responsible for creating and positioning grid content items based on a specified prefab and item count. It instantiates the items and arranges them vertically with a specified offset.
 */
@component
export class GridContentCreator extends BaseScriptComponent {
  getInstructions(): [string, number][] {
    return [
      ["In a large mixing bowl, combine the flour, baking powder, and salt, whisking together until the dry ingredients are evenly distributed throughout.", 3],
      ["Carefully pour the wet ingredients into the dry ingredients, stirring gently with a spatula until no large streaks of flour remain, being cautious not to overmix the batter.", 3],
      ["Simmer the sauce over medium-low heat for 25 to 30 minutes, stirring occasionally to prevent sticking, until the tomatoes have broken down and the sauce has thickened.", 3],
      ["Using a sharp knife, slice the chicken breasts in half horizontally to create thin cutlets, then season generously on both sides with salt, pepper, and garlic powder.", 3],
      ["Arrange the sliced vegetables in overlapping layers in a large, oven-safe skillet, drizzling olive oil between each layer and seasoning lightly with thyme and rosemary.", 3],
      ["After removing the cake from the oven, allow it to cool in the pan for 10 minutes before transferring it to a wire rack to cool completely before frosting.", 3],
      ["Beat the egg whites in a clean, dry bowl with an electric mixer on medium speed until soft peaks form, then gradually add the sugar while continuing to beat until stiff, glossy peaks appear.", 3],
      ["Place the dough on a lightly floured surface and knead by hand for about 8 to 10 minutes, or until the dough is smooth, elastic, and no longer sticks to your hands.", 3],
    ]
  }

  onAwake(): void {
    const instructions = this.getInstructions()

    const yOffset = -6

    let nextOffset = 0

    // TODO create text stub
    for (let i = 0; i < instructions.length; i++) {

      const stepNumber = i + 1

      const [instruction, numLines] = instructions[i];

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
      const numPrevLines = i == 0 ? 0 : Math.ceil(instructions[i - 1].length / 35)

      const screenTransform = target.getComponent("Component.ScreenTransform")


      screenTransform.offsets.setCenter(new vec2(0, -nextOffset))

      nextOffset += numLines * 1.5

      const text = target.getComponent("Component.Text")
      text.text = `${stepNumber}. ${instruction}`

      target.enabled = true
    }
  }
}
