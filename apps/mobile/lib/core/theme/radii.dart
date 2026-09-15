import 'package:flutter/material.dart';

/// Centralized border radius tokens for the Nagrik Design System.
abstract final class NagrikRadii {
  /// 4dp — compact badges, status tags.
  static const double xs = 4.0;

  /// 8dp — standard controls, buttons, chips.
  static const double sm = 8.0;

  /// 12dp — inputs, text fields, search bar.
  static const double md = 12.0;
  static const double input = 12.0;

  /// 14dp — content cards.
  static const double card = 14.0;

  /// 16dp — elevated containers.
  static const double lg = 16.0;

  /// 20dp — hero containers, preview surfaces.
  static const double xl = 20.0;

  /// 24dp — bottom sheets, modal dialogs.
  static const double sheet = 24.0;

  /// 28dp — luxury hero containers, cinematic preview carousels.
  static const double hero = 28.0;

  /// 9999dp — fully rounded pill shape (nav indicator, badges, tags).
  static const double pill = 9999.0;

  // Pre-built BorderRadius objects for convenience
  static final BorderRadius borderRadiusXs = BorderRadius.circular(xs);
  static final BorderRadius borderRadiusSm = BorderRadius.circular(sm);
  static final BorderRadius borderRadiusMd = BorderRadius.circular(md);
  static final BorderRadius borderRadiusCard = BorderRadius.circular(card);
  static final BorderRadius borderRadiusLg = BorderRadius.circular(lg);
  static final BorderRadius borderRadiusXl = BorderRadius.circular(xl);
  static final BorderRadius borderRadiusSheet = BorderRadius.circular(sheet);
  static final BorderRadius borderRadiusHero = BorderRadius.circular(hero);
  static final BorderRadius borderRadiusPill = BorderRadius.circular(pill);
}
