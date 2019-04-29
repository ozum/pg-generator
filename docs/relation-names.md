# Relation Names

Relation names are not easy to determine automatically, because every db admin or developer have their own decisions how to name models. Also there isn't right or wrong about naming relations.

`pg-generator` allows any relation naming method through its templating system. For an example, see `template/sequelize/partials/helper.nunj.html` file in template.

## Naming Collisions

However relation naming collisions happen except when database designs is really basic.

To see a possible example of collision see below DDL.

There are two references from `change_status` table and also another reference from `process` table in `transition` table.

```sql
CREATE TABLE process (
    process_id    serial    PRIMARY KEY,
    name          text
);

CREATE TABLE change_status (
    change_status_id    serial    PRIMARY KEY,
    name                text
);

CREATE TABLE transition (
    transition_id    serial    PRIMARY KEY,
    process          integer   REFERENCES process(process_id),
    current_state    integer   REFERENCES change_status (change_status_id),
    next_state       integer   REFERENCES change_status (change_status_id)
);
```

Even it is not meant a many to many relation here, auto generator cannot determine whether it is a many to many relation or not.

```
                  ┌---------< change_status
                  |
process >--- transition ----< change_status

```

## Alternative Methods

There are some alternative methods to overcome collision. Those alternatives can be used individually or combined.

1. Using custom data file such as `pgen --datafile custom.js`, and provide aliases as you wish for collided relations. See [Custom Data File](/template/directories-files/#custom-data-file)

1. Changing naming method in template, and use your own rules for relation names. See `template/sequelize/partials/helper.nunj.html` in template.

1. You can use `generateName()` method of `pg-structure` as described in [pg-sturcture relation names](http://www.pg-structure.com/relation-names/). `generateName()` method can be used in template. This alternative provides convenience and ultimate flexibility at the same time.

  For example:
  
  ```
    {{ relation.generateName('complex') }}
  ```
