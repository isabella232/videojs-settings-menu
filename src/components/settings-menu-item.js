/**
 * @file settings-menu-item.js
 */

import videojs from 'video.js';

const MenuItem = videojs.getComponent('MenuItem');
const playbackRateMenuButton = videojs.getComponent('PlaybackRateMenuButton');
const component = videojs.getComponent('Component');

const toTitleCase = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * The specific menu item type for selecting a setting
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @param {String=} entry
 * @extends MenuItem
 * @class SettingsMenuItem
 */
class SettingsMenuItem extends MenuItem {

  constructor(player, options, entry) {
    const subMenuName = toTitleCase(entry);
    const SubMenuComponent = videojs.getComponent(subMenuName);

    if (!SubMenuComponent) {
      throw new Error(`Component ${subMenuName} does not exist`);
    }

    super(player, options);
    
    videojs.dom.addClass(this.$('.vjs-menu-item-text'), 'vjs-settings-sub-menu-title');

    this.subMenu = new SubMenuComponent(this.player(), options);

    const update = videojs.bind(this, this.update);
    // To update the sub menu value on click, setTimeout is needed because
    // updating the value is not instant
    const updateAfterTimeout = function() {
      setTimeout(update, 0);
    };

    for (let item of this.subMenu.menu.children()) {
      if (!(item instanceof component)) {
        continue;
      }
      item.on('click', updateAfterTimeout);
    }

    this.update();
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl() {
    const el = super.createEl();

    this.settingsSubMenuValueEl_ = videojs.createEl('div', {
      className: 'vjs-settings-sub-menu-value'
    });

    el.appendChild(this.settingsSubMenuValueEl_);

    this.settingsSubMenuEl_ = videojs.createEl('div', {
      className: 'vjs-settings-sub-menu vjs-hidden'
    });

    el.appendChild(this.settingsSubMenuEl_);

    return el;
  }

  /**
   * Handle click on menu item
   *
   * @method handleClick
   */
  handleClick() {
    // Remove open class to ensure only the open submenu gets this class
    videojs.removeClass(this.el_, 'open');

    super.handleClick();

    // Wether to add or remove vjs-hidden class on the settingsSubMenuEl element
    if (videojs.hasClass(this.settingsSubMenuEl_, 'vjs-hidden')) {
      videojs.removeClass(this.settingsSubMenuEl_, 'vjs-hidden');
    } else {
      videojs.addClass(this.settingsSubMenuEl_, 'vjs-hidden');
    }
  }

  /**
   * Update the sub menus
   *
   * @method update
   */
  update() {
    this.$('.vjs-menu-item-text').innerHTML = this.subMenu.controlText_ + ':';
    this.settingsSubMenuEl_.appendChild(this.subMenu.menu.el_);

    // Playback rate menu button doesn't get a vjs-selected class
    // or sets options_['selected'] on the selected playback rate.
    // Thus we get the submenu value based on the labelEl of playbackRateMenuButton
    if (this.subMenu instanceof playbackRateMenuButton) {
      this.settingsSubMenuValueEl_.innerHTML = this.subMenu.labelEl_.innerHTML;
    } else {
      // Loop trough the submenu items to find the selected child
      for (let subMenuItem of this.subMenu.menu.children_) {
        if (!(subMenuItem instanceof component)) {
          continue;
        }
        // Set submenu value based on what item is selected
        if (subMenuItem.options_.selected || subMenuItem.hasClass('vjs-selected')) {
          this.settingsSubMenuValueEl_.innerHTML = subMenuItem.options_.label;
        }
      }
    }
  }

  /**
   * Hide the sub menu
   */
  hideSubMenu() {
    if (videojs.hasClass(this.el_, 'open')) {
      videojs.addClass(this.settingsSubMenuEl_, 'vjs-hidden');
      videojs.removeClass(this.el_, 'open');
    }
  }

}

SettingsMenuItem.prototype.contentElType = 'button';

videojs.registerComponent('SettingsMenuItem', SettingsMenuItem);
export default SettingsMenuItem;
