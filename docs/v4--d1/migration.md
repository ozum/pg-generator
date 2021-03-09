# Migration

If you use builtin templates without modification, just regenerate them and use `pgen` as usual.

For those using modified templates or their own templates, below are some steps to migrate from v2 to v3:

## You should add `.array` method call to loops.

v2:

    {% for column in table.columns -%}

    {% endfor %}

v3:

    {% for column in table.columns.array -%}

    {% endfor %}

v2:

    {{ relation.sourceConstraint.columns[0].name }}

v3:

    {{ relation.sourceConstraint.columns.array[0].name }}

## Change `column#foreignKeyConstraint` to `column#foreignKeyConstraints.array`

In database, same column may be part of more than one foreign key constraints. Because of this foreignKeyConstraint
is changed to foreignKeyConstraints in pg-structure module. As a consequence you should change your templates like example
below:

v2:

    {{ column.foreignKeyConstraint }}

v3:

    {{ column.foreignKeyConstraints.array[0] }}

## Change `column#referencedColumn` to `column#referencedColumns.array`

Same reason above.

v2:

    {{ column.referencedColumn }}

v3:

    {{ column.referencedColumns.array[0] }}
