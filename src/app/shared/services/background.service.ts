import { Injectable } from '@angular/core';

export const firstBackground = {
    'background' : 'url(./../../../assets/images/home/trongdong.png)',
    'background-size' : 'cover'
};

export const secondBackground = {
    'background' : 'url(./../../../assets/images/home/trongdong.png)',
    'background-size' : 'cover'
};

export const thirdBackground = {
    'background' : 'url(./../../../assets/images/home/3.png)',
    'background-size' : 'cover'
};

export const fourthBackground = {
    'background' : 'url(./../../../assets/images/home/4.png)',
    'background-size' : 'cover'
};

export const fifthBackground = {
    'background' : 'url(./../../../assets/images/home/5.png) center center no-repeat',
    'background-size' : 'cover'
};

export const sixthBackground = {
    'background' : 'url(./../../../assets/images/home/6.png) center center no-repeat',
    'background-size' : 'cover'
};

export const seventhBackground = {
    'background' : 'url(./../../../assets/images/home/7.png) center center no-repeat',
    'background-size' : 'cover'
};

export const eighthBackground = {
  'background' : 'url(./../../../assets/images/home/8.png) center center no-repeat',
  'background-size' : 'cover'
};

export const ninethBackground = {
  'background' : 'url(./../../../assets/images/home/9.png) center center no-repeat',
  'background-size' : 'cover'
};

export const tenthBackground = {
  'background' : 'url(./../../../assets/images/home/10.png) center center no-repeat',
  'background-size' : 'cover'
};

export const defaultBackground = {
    'background' : 'url(./../../../assets/images/home/trongdong.png) no-repeat',
    'background-size' : 'cover'
}


@Injectable({ providedIn: 'root' })
export class BackgroundService {

  toggleFirstBackground() {
    this.setBackground(firstBackground);
  }

  toggleSecondBackground() {
    this.setBackground(secondBackground);
  }

  toggleThirdBackground() {
    this.setBackground(thirdBackground);
  }

  toggleFourthBackground() {
    this.setBackground(fourthBackground);
  }

  toggleFifthBackground() {
    this.setBackground(fifthBackground);
  }

  toggleSixthBackground() {
    this.setBackground(sixthBackground);
  }

  toggleSeventhBackground() {
    this.setBackground(seventhBackground);
  }

  toggleEighthBackground() {
    this.setBackground(eighthBackground);
  }

  toggleNinethBackground() {
    this.setBackground(ninethBackground);
  }

  toggleTenthBackground() {
    this.setBackground(tenthBackground);
  }

  toggleDefaultBackground() {
    this.setBackground(defaultBackground);
  }

  private setBackground(background: {},) {
    Object.keys(background).forEach(b =>
      document.getElementById('background').style.setProperty(`${b}`, background[b])
    );
  }
}
