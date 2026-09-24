import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../../../core/network/api_constants.dart';

class LgdSelectionResult {
  final int? stateCode;
  final String stateName;
  final int? districtCode;
  final String districtName;
  final int? subdistrictCode;
  final String subdistrictName;
  final int? localBodyCode;
  final String localBodyName;
  final String pincode;

  const LgdSelectionResult({
    this.stateCode,
    required this.stateName,
    this.districtCode,
    required this.districtName,
    this.subdistrictCode,
    this.subdistrictName = '',
    this.localBodyCode,
    this.localBodyName = '',
    this.pincode = '',
  });

  String get displayName {
    if (localBodyName.isNotEmpty) {
      return '$localBodyName, $districtName';
    }
    if (subdistrictName.isNotEmpty) {
      return '$subdistrictName, $districtName';
    }
    return '$districtName, $stateName';
  }
}

class LgdCascadingSheet extends StatefulWidget {
  final Function(LgdSelectionResult selection) onSelected;

  const LgdCascadingSheet({
    super.key,
    required this.onSelected,
  });

  static Future<LgdSelectionResult?> show(BuildContext context) {
    return showModalBottomSheet<LgdSelectionResult>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => FractionallySizedBox(
        heightFactor: 0.85,
        child: LgdCascadingSheet(
          onSelected: (res) {
            Navigator.of(ctx).pop(res);
          },
        ),
      ),
    );
  }

  @override
  State<LgdCascadingSheet> createState() => _LgdCascadingSheetState();
}

class _LgdCascadingSheetState extends State<LgdCascadingSheet> {
  int _currentStep = 1; // 1: State, 2: District, 3: Sub-District, 4: Local Body
  bool _isLoading = false;
  String _searchQuery = '';
  final TextEditingController _searchCtrl = TextEditingController();

  // Selected values
  int? _selectedStateCode;
  String _selectedStateName = '';
  int? _selectedDistrictCode;
  String _selectedDistrictName = '';
  int? _selectedSubdistrictCode;
  String _selectedSubdistrictName = '';
  int? _selectedLocalBodyCode;
  String _selectedLocalBodyName = '';
  String _selectedPincode = '';

  // Data lists
  List<Map<String, dynamic>> _states = [];
  List<Map<String, dynamic>> _districts = [];
  List<Map<String, dynamic>> _subdistricts = [];
  List<Map<String, dynamic>> _localBodies = [];

  @override
  void initState() {
    super.initState();
    _fetchStates();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Map<String, String> get _headers => {
        'apikey': ApiConstants.supabaseAnonKey,
        'Authorization': 'Bearer ${ApiConstants.supabaseAnonKey}',
        'Content-Type': 'application/json',
      };

  Future<void> _fetchStates() async {
    setState(() => _isLoading = true);
    try {
      final url = Uri.parse(
          '${ApiConstants.supabaseUrl}/rest/v1/lgd_states?select=state_code,state_name&order=state_name.asc');
      final res = await http.get(url, headers: _headers);
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        setState(() {
          _states = data.cast<Map<String, dynamic>>();
          _isLoading = false;
        });
      }
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _fetchDistricts(int stateCode) async {
    setState(() => _isLoading = true);
    try {
      final url = Uri.parse(
          '${ApiConstants.supabaseUrl}/rest/v1/lgd_districts?state_code=eq.$stateCode&select=district_code,district_name&order=district_name.asc');
      final res = await http.get(url, headers: _headers);
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        setState(() {
          _districts = data.cast<Map<String, dynamic>>();
          _isLoading = false;
        });
      }
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _fetchSubdistricts(int districtCode) async {
    setState(() => _isLoading = true);
    try {
      final url = Uri.parse(
          '${ApiConstants.supabaseUrl}/rest/v1/lgd_subdistricts?district_code=eq.$districtCode&select=subdistrict_code,subdistrict_name&order=subdistrict_name.asc');
      final res = await http.get(url, headers: _headers);
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        setState(() {
          _subdistricts = data.cast<Map<String, dynamic>>();
          _isLoading = false;
        });
      }
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _fetchLocalBodies(int districtCode) async {
    setState(() => _isLoading = true);
    try {
      final url = Uri.parse(
          '${ApiConstants.supabaseUrl}/rest/v1/lgd_local_bodies?district_code=eq.$districtCode&select=local_body_code,local_body_name,pincode&order=local_body_name.asc&limit=150');
      final res = await http.get(url, headers: _headers);
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        setState(() {
          _localBodies = data.cast<Map<String, dynamic>>();
          _isLoading = false;
        });
      }
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _onStateTapped(Map<String, dynamic> state) {
    _searchCtrl.clear();
    _searchQuery = '';
    final code = state['state_code'] as int;
    final name = state['state_name'] as String;
    setState(() {
      _selectedStateCode = code;
      _selectedStateName = name;
      _currentStep = 2;
    });
    _fetchDistricts(code);
  }

  void _onDistrictTapped(Map<String, dynamic> dist) {
    _searchCtrl.clear();
    _searchQuery = '';
    final code = dist['district_code'] as int;
    final name = dist['district_name'] as String;
    setState(() {
      _selectedDistrictCode = code;
      _selectedDistrictName = name;
      _currentStep = 3;
    });
    _fetchSubdistricts(code);
  }

  void _onSubdistrictTapped(Map<String, dynamic> sub) {
    _searchCtrl.clear();
    _searchQuery = '';
    final code = sub['subdistrict_code'] as int;
    final name = sub['subdistrict_name'] as String;
    setState(() {
      _selectedSubdistrictCode = code;
      _selectedSubdistrictName = name;
      _currentStep = 4;
    });
    if (_selectedDistrictCode != null) {
      _fetchLocalBodies(_selectedDistrictCode!);
    }
  }

  void _onLocalBodyTapped(Map<String, dynamic> body) {
    final code = body['local_body_code'] as int?;
    final name = body['local_body_name'] as String? ?? '';
    final pin = body['pincode'] as String? ?? '';

    _selectedLocalBodyCode = code;
    _selectedLocalBodyName = name;
    _selectedPincode = pin;

    _confirmSelection();
  }

  void _confirmSelection() {
    final res = LgdSelectionResult(
      stateCode: _selectedStateCode,
      stateName: _selectedStateName,
      districtCode: _selectedDistrictCode,
      districtName: _selectedDistrictName,
      subdistrictCode: _selectedSubdistrictCode,
      subdistrictName: _selectedSubdistrictName,
      localBodyCode: _selectedLocalBodyCode,
      localBodyName: _selectedLocalBodyName,
      pincode: _selectedPincode,
    );
    widget.onSelected(res);
  }

  List<Map<String, dynamic>> _getFilteredList() {
    List<Map<String, dynamic>> currentList;
    String nameField;

    switch (_currentStep) {
      case 1:
        currentList = _states;
        nameField = 'state_name';
        break;
      case 2:
        currentList = _districts;
        nameField = 'district_name';
        break;
      case 3:
        currentList = _subdistricts;
        nameField = 'subdistrict_name';
        break;
      case 4:
      default:
        currentList = _localBodies;
        nameField = 'local_body_name';
        break;
    }

    if (_searchQuery.trim().isEmpty) return currentList;
    final q = _searchQuery.toLowerCase();
    return currentList.where((item) {
      final name = (item[nameField] ?? '').toString().toLowerCase();
      final pin = (item['pincode'] ?? '').toString();
      return name.contains(q) || pin.contains(q);
    }).toList();
  }

  String get _stepTitle {
    switch (_currentStep) {
      case 1:
        return 'Select State (राज्य)';
      case 2:
        return 'Select District (ज़िला)';
      case 3:
        return 'Select Tehsil / Block (प्रखंड)';
      case 4:
      default:
        return 'Select Village / Ward (ग्राम / वार्ड)';
    }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _getFilteredList();

    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF101522),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        children: [
          // Drag Handle
          const SizedBox(height: 12),
          Container(
            width: 44,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 12),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _stepTitle,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Official Indian LGD Hierarchy (Step $_currentStep of 4)',
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                if (_currentStep > 1)
                  TextButton.icon(
                    onPressed: () {
                      setState(() {
                        _currentStep--;
                        _searchCtrl.clear();
                        _searchQuery = '';
                      });
                    },
                    icon: const Icon(Icons.arrow_back, size: 16, color: Color(0xFFFF5722)),
                    label: const Text(
                      'Back',
                      style: TextStyle(color: Color(0xFFFF5722), fontWeight: FontWeight.bold),
                    ),
                  ),
              ],
            ),
          ),

          // Breadcrumbs
          if (_selectedStateName.isNotEmpty) ...[
            const SizedBox(height: 8),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF182032),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white10),
              ),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _breadcrumbChip('1', _selectedStateName, 1),
                    if (_selectedDistrictName.isNotEmpty) ...[
                      const Icon(Icons.chevron_right, size: 16, color: Colors.white38),
                      _breadcrumbChip('2', _selectedDistrictName, 2),
                    ],
                    if (_selectedSubdistrictName.isNotEmpty) ...[
                      const Icon(Icons.chevron_right, size: 16, color: Colors.white38),
                      _breadcrumbChip('3', _selectedSubdistrictName, 3),
                    ],
                  ],
                ),
              ),
            ),
          ],

          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: TextField(
              controller: _searchCtrl,
              onChanged: (val) => setState(() => _searchQuery = val),
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                filled: true,
                fillColor: const Color(0xFF182032),
                hintText: 'Search location or PIN...',
                hintStyle: const TextStyle(color: Colors.white38, fontSize: 14),
                prefixIcon: const Icon(Icons.search, color: Colors.white54, size: 20),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Colors.white12),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Colors.white12),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFFFF5722)),
                ),
              ),
            ),
          ),

          // Content List
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: Color(0xFFFF5722)),
                  )
                : filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.location_off, size: 40, color: Colors.white38),
                            const SizedBox(height: 8),
                            Text(
                              _searchQuery.isEmpty ? 'No locations found' : 'No matches for "$_searchQuery"',
                              style: const TextStyle(color: Colors.white54, fontSize: 13),
                            ),
                            if (_currentStep > 2) ...[
                              const SizedBox(height: 12),
                              ElevatedButton(
                                onPressed: _confirmSelection,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFFF5722),
                                  foregroundColor: Colors.white,
                                ),
                                child: Text('Confirm at $_selectedDistrictName Level'),
                              ),
                            ]
                          ],
                        ),
                      )
                    : ListView.separated(
                        itemCount: filtered.length,
                        separatorBuilder: (context, index) => const Divider(
                          color: Colors.white10,
                          height: 1,
                          indent: 16,
                          endIndent: 16,
                        ),
                        itemBuilder: (ctx, idx) {
                          final item = filtered[idx];
                          final title = _getTitle(item);
                          final subtitle = _getSubtitle(item);

                          return ListTile(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
                            title: Text(
                              title,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            subtitle: subtitle != null
                                ? Text(
                                    subtitle,
                                    style: const TextStyle(
                                      color: Colors.white54,
                                      fontSize: 12,
                                    ),
                                  )
                                : null,
                            trailing: const Icon(
                              Icons.chevron_right,
                              color: Colors.white24,
                              size: 18,
                            ),
                            onTap: () {
                              switch (_currentStep) {
                                case 1:
                                  _onStateTapped(item);
                                  break;
                                case 2:
                                  _onDistrictTapped(item);
                                  break;
                                case 3:
                                  _onSubdistrictTapped(item);
                                  break;
                                case 4:
                                  _onLocalBodyTapped(item);
                                  break;
                              }
                            },
                          );
                        },
                      ),
          ),

          // Shortcut: Confirm at Current Level
          if (_currentStep >= 2)
            Padding(
              padding: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  onPressed: _confirmSelection,
                  icon: const Icon(Icons.check_circle, size: 18),
                  label: Text('Use Current Level ($_selectedDistrictName)'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFF5722),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _breadcrumbChip(String step, String label, int targetStep) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _currentStep = targetStep;
          _searchCtrl.clear();
          _searchQuery = '';
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Text(
          label,
          style: TextStyle(
            color: _currentStep == targetStep ? const Color(0xFFFF5722) : Colors.white70,
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  String _getTitle(Map<String, dynamic> item) {
    switch (_currentStep) {
      case 1:
        return item['state_name'] ?? '';
      case 2:
        return item['district_name'] ?? '';
      case 3:
        return item['subdistrict_name'] ?? '';
      case 4:
      default:
        return item['local_body_name'] ?? '';
    }
  }

  String? _getSubtitle(Map<String, dynamic> item) {
    if (_currentStep == 4 && item['pincode'] != null && item['pincode'].toString().isNotEmpty) {
      return 'PIN: ${item['pincode']}';
    }
    return null;
  }
}
