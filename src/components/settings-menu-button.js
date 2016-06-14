
/**
 * @file settings-menu-button.js
 */
import videojs from 'video.js';
import SettingsMenuItem from './settings-menu-item.js';
const MenuButton = videojs.getComponent('MenuButton');
const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

/**
 * The component for controlling the settings menu
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends MenuButton
 * @class SettingsMenuButton
 */
class SettingsMenuButton extends MenuButton {

  constructor(player, options){
    super(player, options);

    this.el_.setAttribute('aria-label','Settings Menu');

    this.on('mouseleave', videojs.bind(this, this.hideChildren));
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */
  buildCSSClass() {
    return `vjs-settings-menu vjs-icon-cog ${super.buildCSSClass()}`;
  }

  /**
   * Create the settings menu
   *
   * @return {Menu} Menu object populated with items
   * @method createMenu
   */
  createMenu() {
    let menu = new Menu(this.player());
    let entries = this.options_.entries;

    if (entries) {
      for (let entry of entries) {

        let settingsMenuItem = new SettingsMenuItem(this.player(), this.options_, entry)

        menu.addChild(settingsMenuItem);
        settingsMenuItem.on('menuitemclicked', videojs.bind(this, this.hideChildren));
      }
    }

    return menu;
  }

  /**
   * Hide all the sub menus
   */
  hideChildren() {
    for (let menuChild of this.menu.children())
    {
      menuChild.hideSubMenu();
    }
  }

}

SettingsMenuButton.prototype.controlText_ = 'Settings Menu';

Component.registerComponent('SettingsMenuButton', SettingsMenuButton);
export default SettingsMenuButton;