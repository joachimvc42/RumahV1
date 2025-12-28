<?php
/**
 * Common helper functions for RumahYa advanced site.
 *
 * This file contains reusable functions to interact with the database
 * and process data (images, formatting) for villas and lands.
 */

/**
 * Fetch all villas from the database.
 *
 * @param PDO $pdo
 * @return array
 */
function getAllVillas(PDO $pdo): array
{
    $stmt = $pdo->query("SELECT * FROM villas ORDER BY created_at DESC");
    return $stmt->fetchAll();
}

/**
 * Fetch a single villa by ID.
 *
 * @param PDO $pdo
 * @param int $id
 * @return array|null
 */
function getVillaById(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare("SELECT * FROM villas WHERE id = ?");
    $stmt->execute([$id]);
    $villa = $stmt->fetch();
    return $villa ?: null;
}

/**
 * Fetch all lands from the database.
 *
 * @param PDO $pdo
 * @return array
 */
function getAllLands(PDO $pdo): array
{
    $stmt = $pdo->query("SELECT * FROM lands ORDER BY created_at DESC");
    return $stmt->fetchAll();
}

/**
 * Fetch a single land by ID.
 *
 * @param PDO $pdo
 * @param int $id
 * @return array|null
 */
function getLandById(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare("SELECT * FROM lands WHERE id = ?");
    $stmt->execute([$id]);
    $land = $stmt->fetch();
    return $land ?: null;
}

/**
 * Parse an image field from the database and return an array of image URLs.
 *
 * The image field may contain:
 *  - a JSON encoded array of relative URLs
 *  - a comma separated list
 *  - a single filename (with or without uploads/ prefix)
 *
 * @param string|null $field
 * @return array
 */
function rumahya_decode_images(?string $field): array
{
    if (!$field) {
        return [];
    }
    $field = trim($field);
    // Try JSON decode
    if ($field !== '' && ($field[0] === '[' || $field[0] === '{')) {
        $decoded = json_decode($field, true);
        if (is_array($decoded)) {
            $images = [];
            foreach ($decoded as $img) {
                $images[] = rumahya_normalize_image_path((string)$img);
            }
            return $images;
        }
    }
    // Try comma-separated
    if (strpos($field, ',') !== false) {
        $parts = array_map('trim', explode(',', $field));
        $images = [];
        foreach ($parts as $part) {
            if ($part !== '') {
                $images[] = rumahya_normalize_image_path($part);
            }
        }
        return $images;
    }
    // Single image
    return [rumahya_normalize_image_path($field)];
}

/**
 * Normalize an image path by ensuring the uploads/ prefix is present.
 *
 * @param string $path
 * @return string
 */
function rumahya_normalize_image_path(string $path): string
{
    $path = trim($path, " \"'");
    // Remove leading slash
    $path = ltrim($path, '/');
    if (strpos($path, 'uploads/') === 0) {
        return $path;
    }
    return 'uploads/' . $path;
}

/**
 * Format a price stored as an integer representing millions of Indonesian Rupiah.
 *
 * @param mixed $value
 * @return string
 */
function rumahya_format_price($value): string
{
    if (!is_numeric($value)) {
        return '';
    }
    // Price stored as "million IDR per month"
    return number_format((int)$value, 0, '.', ',') . ' Mio IDR / month';
}

/**
 * Return a badge HTML for a boolean property if true.
 *
 * @param mixed $value
 * @param string $label
 * @return string
 */
function rumahya_boolean_badge($value, string $label): string
{
    if ($value) {
        return '<span class="badge">' . htmlspecialchars($label) . '</span>';
    }
    return '';
}