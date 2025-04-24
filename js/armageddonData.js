/**
 * An array of Armageddon events.
 *
 * This array contains both Date objects for events you can represent as such
 * and numeric constants for events with years that exceed what the Date object can handle.
 *
 * @type {(Date|number)[]}
 */
var armageddons = [
    // Events defined as Date objects:
    new Date(2020, 11, 31, 24, 0, 0),
    new Date(2021, 11, 31, 24, 0, 0),
    new Date(2026, 11, 31, 24, 0, 0),
    new Date(2036, 11, 31, 24, 0, 0),
    new Date(2060, 11, 31, 24, 0, 0),
    new Date(2129, 11, 31, 24, 0, 0),
    new Date(2239, 11, 31, 24, 0, 0),
    new Date(2242, 11, 31, 24, 0, 0),
    new Date(2280, 11, 31, 24, 0, 0),
    new Date(2780, 11, 31, 24, 0, 0),
    new Date(2892, 11, 31, 24, 0, 0),
    new Date(3797, 11, 31, 24, 0, 0),
    new Date(5079, 11, 31, 24, 0, 0),
    // Numeric events for armageddons that cannot be represented as Date objects:
    300000,
    500000,
    1000000,
    100000000,
    500000000,
    600000000,
    1000000000,
    1300000000,
    7590000000,
    22000000000
  ];
  
  /**
   * An array of descriptions for each Armageddon event.
   *
   * Each element is a two-item array:
   *    [ Event Title or Label, Detailed Description ]
   *
   * @type {string[][]}
   */
  var descriptions = [
    [
      '2020',
      'In This year, Jeane Dixon claims, Jesus will return to defeat the unholy trinity of the Antichrist, Satan, and the False prophet between 2020 and 2037.'
    ],
    [
      '2021',
      'F. Kenton Beshore predicted the Second Coming of Jesus between 2018 and 2028, with the Rapture by 2021 at the latest.'
    ],
    [
      '2026',
      "Messiah Foundation International says an asteroid will collide with Earth in accordance with Riaz Ahmed Gohar Shahi's predictions in The Religion of God."
    ],
    [
      '2036',
      'NASA says an asteroid (99942) Apophis smashes into Earth.'
    ],
    [
      '2060',
      'Isaac Newton in his published manuscript says an apocalypse is expected after the year 2026.'
    ],
    [
      '2129',
      "Said Nursî's (this Sunni Muslim theologian) prediction."
    ],
    [
      '2239',
      "According to an opinion about the Talmud in mainstream Orthodox Judaism, the Messiah will come within 6000 years of Adam's creation, and the world may be destroyed 1000 years later."
    ],
    [
      '2242',
      "End of the world by the theory that our Sun will be destroyed."
    ],
    [
      '2280',
      "Rashad Khalifa (Egyptian-American biochemist) researched the Quran and claimed the world will end during that year."
    ],
    [
      '2780',
      "The End of the World according to prophetic icons, written in the late 18th century per Abel the Seer's predictions."
    ],
    [
      '2892',
      "Another prediction by Abel the Monk (Vasilii Vasiliev)."
    ],
    [
      '3797',
      'The date of The End of the World, written by Nostradamus in "Letter to the Son of Caesar".'
    ],
    [
      '5079',
      'Another prediction allegedly by Baba Vanga.'
    ],
    [
      '3 thousand years',
      'Peter Tuthill expects WR 104 (a part of a triple star) to explode in a supernova producing a gamma ray burst that could threaten life on Earth.'
    ],
    [
      '5 thousand years',
      'Nick Bostrom believes that Earth will likely be hit by an asteroid roughly 1 km in diameter.'
    ],
    [
      '1 million years',
      'The Geological Society says that Earth will undergo a supervolcanic eruption large enough to erupt 3,200 km³ of magma.'
    ],
    [
      '100 million years',
      'Stephen A. Nelson claims that Earth will likely be hit by an asteroid about 10–15 km in diameter.'
    ],
    [
      '500 million years',
      'James Kasting states that the level of atmospheric carbon dioxide will drop dramatically, making Earth uninhabitable.'
    ],
    [
      '600 million years',
      "Anne Minard predicts that a gamma ray burst or a massive supernova within 6,500 light-years of Earth could affect its ozone layer and trigger a mass extinction."
    ],
    [
      '1 billion years',
      "The estimated end of the Sun's current phase, after which it will swell into a red giant, possibly swallowing or scorching Earth."
    ],
    [
      '1.3 billion years',
      'It is estimated that all eukaryotic life will die out due to carbon dioxide starvation, leaving only prokaryotes.'
    ],
    [
      '7.59 billion years',
      'David Powell believes that Earth and the Moon will likely be destroyed by falling into the Sun.'
    ],
    [
      '22 billion years',
      'The end of the Universe in the Big Rip scenario.'
    ]
  ];
  