ALTER TABLE `widget` ADD `border_color` text NOT NULL DEFAULT '#ededed';
ALTER TABLE `widget` ALTER COLUMN `border_color` DROP DEFAULT;