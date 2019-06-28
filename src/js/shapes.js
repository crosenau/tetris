import Vector from './Vector';


export const J = {
  label: 'J',
  rotations: [
    [
      new Vector(0, 0),
      new Vector(0, 1),
      new Vector(1, 1),
      new Vector(2, 1)
    ],
    [
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(1, 2),
      new Vector(2, 0)
    ],
    [
      new Vector(0, 1),
      new Vector(1, 1),
      new Vector(2, 1),
      new Vector(2, 2)
    ],
    [
      new Vector(0, 2),
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(1, 2)
    ]
  ]
};

export const L = {
  label: 'L',
  rotations: [
    [
      new Vector(0, 1),
      new Vector(1, 1),
      new Vector(2, 0),
      new Vector(2, 1)
    ],
    [
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(1, 2),
      new Vector(2, 2)
    ],
    [
      new Vector(0, 1),
      new Vector(0, 2),
      new Vector(1, 1),
      new Vector(2, 1)
    ],
    [
      new Vector(0, 0),
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(1, 2)
    ]
  ]
};

export const T = {
  label: 'T',
  rotations: [
    [
      new Vector(0, 1),
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(2, 1)
    ],
    [
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(1, 2),
      new Vector(2, 1)
    ],
    [
      new Vector(0, 1),
      new Vector(1, 1),
      new Vector(1, 2),
      new Vector(2, 1)
    ],
    [
      new Vector(0, 1),
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(1, 2)
    ]
  ]
};

export const I = {
  label: 'I',
  rotations: [
    [
      new Vector(0, 1),
      new Vector(1, 1),
      new Vector(2, 1),
      new Vector(3, 1)
    ],
    [
      new Vector(2, 0),
      new Vector(2, 1),
      new Vector(2, 2),
      new Vector(2, 3)
    ],
    [
      new Vector(0, 2),
      new Vector(1, 2),
      new Vector(2, 2),
      new Vector(3, 2)
    ],
    [
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(1, 2),
      new Vector(1, 3)
    ]
  ]
};

export const O = {
  label: 'O',
  rotations: [
    [
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(2, 0),
      new Vector(2, 1)
    ]
  ]
};

export const S = {
  label: 'S',
  rotations: [
    [
      new Vector(0, 1),
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(2, 0)
    ],
    [
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(2, 1),
      new Vector(2, 2)
    ],
    [
      new Vector(0, 2),
      new Vector(1, 1),
      new Vector(1, 2),
      new Vector(2, 1)
    ],
    [
      new Vector(0, 0),
      new Vector(0, 1),
      new Vector(1, 1),
      new Vector(1, 2)
    ]
  ]
};

export const Z = {
  label: 'Z',
  rotations: [
    [
      new Vector(0, 0),
      new Vector(1, 0),
      new Vector(1, 1),
      new Vector(2, 1)
    ],
    [
      new Vector(1, 1),
      new Vector(1, 2),
      new Vector(2, 0),
      new Vector(2, 1)
    ],
    [
      new Vector(0, 1),
      new Vector(1, 1),
      new Vector(1, 2),
      new Vector(2, 2)
    ],
    [
      new Vector(0, 1),
      new Vector(0, 2),
      new Vector(1, 0),
      new Vector(1, 1)
    ]
  ]
};