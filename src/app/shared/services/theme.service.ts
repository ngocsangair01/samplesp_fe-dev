import { Injectable } from '@angular/core';

export const blueVioletTheme = {
    'background-color-header': '#2673b4',
    'background-color-nav': '#222d32',
    'background-color-expand' : '#565c61',
    'color-nav': '#fff',
    'primary-color': '#3f51b5',
    'active-arrow-color': '#ffffff',
    'primary-color-hover': '#3F51FD',
    'color-nav-active':'#5f727d',
    'background-parent-active':'#7ca9c3',
    'background-grid-header-left': '#2673b4',
    'background-grid-header-right': '#2673b4',
    'border-bottom-grid': '1px solid #2673b4',
    'background-grid': '#ffffdc',
    'background-button': '#2673b4',
    'background-button-expant': 'rgba(198,31,27,1)',
    'background-ui-table': '#2673b4',
    'political-header-wrapper-bg': '#2673b4',
    'ui-tabview-color': '#ffffff',
    'high-light-text': '#ffffff',
    'yellow-stroke': '#f6b76d'
};

export const lightGreenTheme = {
    'background-color-header': '#31c0be',
    'background-color-nav': '#c7c7c7',
    'background-color-expand' : '#d4d4d4',
    'color-nav': '#444',
    'primary-color': '#31c0be',
    'active-arrow-color': '#000000',
    'primary-color-hover': '#31C0F6',
    'color-nav-active':'#a7b7b7',
    'background-parent-active':'#6ab9b8',
    'background-grid-header-left': '#31c0be',
    'background-grid-header-right': '#31c0be',
    'border-bottom-grid': '1px solid #31c0be',
    'background-grid': '#ffffdc',
    'background-button': '#31c0be',
    'background-button-expant': '#c7c7c7',
    'background-ui-table': '#31c0be',
    'political-header-wrapper-bg': '#31c0be',
    'ui-tabview-color': '#fff',
    'high-light-text': '#ffffff',
    'yellow-stroke': '#f6b76d'
};

export const greenTheme = {
    'background-color-header': '#609e3b',
    'background-color-nav': '#4d394b',
    'background-color-expand' : '#3e313c',
    'color-nav': '#ddd',
    'primary-color': '#609e3b',
    'active-arrow-color': '#ffffff',
    'primary-color-hover': '#609E72',
    'color-nav-active':'#5d6469',
    'background-parent-active':'#3b5665',
    'background-grid-header-left': '#609e3b',
    'background-grid-header-right': '#609e3b',
    'border-bottom-grid': '1px solid #609e3b',
    'background-grid': '#ffffdc',
    'background-button': '#609e3b',
    'background-button-expant': '#3e313c',
    'background-ui-table': '#609e3b',
    'political-header-wrapper-bg': '#609e3b',
    'ui-tabview-color': '#fff',
    'high-light-text': '#ffffff',
    'yellow-stroke': '#f6b76d'
};

export const blueSkyTheme = {
    'background-color-header': '#00adca',
    'background-color-nav': '#222d32',
    'background-color-expand' : '#2c3b41',
    'color-nav': '#b8c7ce',
    'primary-color': '#00adca',
    'active-arrow-color': '#ffffff',
    'primary-color-hover': '#00ADEA',
    'color-nav-active':'#5f727d',
    'background-parent-active':'#3b5665',
    'background-grid-header-left': '#00adca',
    'background-grid-header-right': '#00adca',
    'border-bottom-grid': '1px solid #00adca',
    'background-grid': '#ffffdc',
    'background-button': '#00adca',
    'background-button-expant': 'rgba(198,31,27,1)',
    'background-ui-table': '#00adca',
    'political-header-wrapper-bg': '#00adca',
    'ui-tabview-color': '#fff',
    'high-light-text': '#ffffff',
    'yellow-stroke': '#f6b76d'
};

export const defaultTheme = {
    'background-color-header': '#e6272e',
    'background-color-nav': '#b21921',
    'background-color-expand' : '#565c61',
    'color-nav': '#e2ff02',
    'primary-color': '#3f51b5',
    'active-arrow-color': '#ffffff',
    'primary-color-hover': '#3F51FD',
    'color-nav-active':'#5f727d',
    'background-parent-active':'#7ca9c3',
    'background-grid-header-left': '#b21921',
    'background-grid-header-right': '#f89a2f',
    'border-bottom-grid': '1px solid #e84b42',
    'background-grid': '#ffffdc',
    'background-button': '#b21921',
    'background-button-expant': '#b21921',
    'background-ui-table': '#f89a2f',
    'political-header-wrapper-bg': '#b21921',
    'ui-tabview-color': '#fff',
    'high-light-text': '#ffffff',
    'yellow-stroke': '#f6b76d'
}


@Injectable({ providedIn: 'root' })
export class ThemeService {

  toggleBlueViolet() {
    this.setTheme(blueVioletTheme);
  }

  toggleLightGreen() {
    this.setTheme(lightGreenTheme);
  }

  toggleBlueSky() {
    this.setTheme(blueSkyTheme);
  }

  toggleGreen() {
    this.setTheme(greenTheme);
  }

  toggleDefaultTheme() {
    this.setTheme(defaultTheme);
  }

  private setTheme(theme: {}) {
    Object.keys(theme).forEach(k =>
      document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  }
}
