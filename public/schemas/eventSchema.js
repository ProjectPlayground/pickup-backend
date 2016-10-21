

var schemes = {
  "utc_offset": {
    "type": Number
  },
  "venue": {
    "type": Object,

    "zip": {
      "type": String
    },
    "country": {
      "type": String
    },
    "localized_country_name": {
      "type": String
    },
    "city": {
      "type": String
    },
    "address_1": {
      "type": String
    },
    "name": {
      "type": String
    },
    "lon": {
      "type": Number
    },
    "id": {
      "type": Number
    },
    "state": {
      "type": String
    },
    "lat": {
      "type": Number
    },
    "repinned": {
      "type": Boolean
    }

  },
  "headcount": {
    "type": Number
  },
  "distance": {
    "type": Number
  },
  "visibility": {
    "type": String
  },
  "waitlist_count": {
    "type": Number
  },
  "created": {
    "type": Number
  },
  "maybe_rsvp_count": {
    "type": Number
  },
  "description": {
    "type": String
  },
  "how_to_find_us": {
    "type": String
  },
  "event_url": {
    "type": String
  },
  "yes_rsvp_count": {
    "type": Number
  },
  "duration": {
    "type": Number
  },
  "rsvp_sample": {
    "type": Array,
    "items": {
      "type": Object,
      "member": {
        "type": Object,

        "member_id": {
          "type": Number
        },
        "name": {
          "type": String
        },
        "self": {
          "type": Object,

          "friend": {
            "type": Boolean
          }

        }

      },
      "rsvp_id": {
        "type": Number
      },
      "mtime": {
        "type": Number
      },
      "created": {
        "type": Number
      },
      "member_photo": {
        "type": Object,

        "highres_link": {
          "type": String
        },
        "photo_id": {
          "type": Number
        },
        "base_url": {
          "type": String
        },
        "type": {
          "type": String
        },
        "photo_link": {
          "type": String
        },
        "thumb_link": {
          "type": String
        }

      }

    }
  },
  "name": {
    "type": String
  },
  "id": {
    "type": String
  },
  "time": {
    "type": Number
  },
  "updated": {
    "type": Number
  },
  "group": {
    "type": Object,

    "join_mode": {
      "type": String
    },
    "created": {
      "type": Number
    },
    "name": {
      "type": String
    },
    "group_lon": {
      "type": Number
    },
    "id": {
      "type": Number
    },
    "urlname": {
      "type": String
    },
    "group_photo": {
      "type": Object,

      "highres_link": {
        "type": String
      },
      "photo_id": {
        "type": Number
      },
      "base_url": {
        "type": String
      },
      "type": {
        "type": String
      },
      "photo_link": {
        "type": String
      },
      "thumb_link": {
        "type": String
      }

    },
    "group_lat": {
      "type": Number
    },
    "who": {
      "type": String
    }

  },
  "status": {
    "type": String
  }


};

module.export = schemes;
