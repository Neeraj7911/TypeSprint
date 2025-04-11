import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CustomCursor from "../components/CustomCursor";

const ExamPage = () => {
  const navigate = useNavigate();

  const nationalExams = [
    {
      name: "SSC CHSL",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal", "Krutidev"],
      details: "Typing for DEO, LDC, JSA. Choose English or Hindi.",
      category: "National",
    },
    {
      name: "SSC CGL",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal", "Krutidev"],
      details: "DEST for Tax Assistant. English primary, Hindi optional.",
      category: "National",
    },
    {
      name: "RRB NTPC",
      englishWPM: 30,
      hindiWPM: 25,
      fonts: ["Mangal", "Krutidev"],
      details: "For Junior Clerk, Accounts Clerk. English or Hindi.",
      category: "Railway",
    },
    {
      name: "BSF HCM",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Head Constable. Choose English or Hindi.",
      category: "Defence",
    },
    {
      name: "Indian Army Agniveer Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal", "Krutidev"],
      details: "Agniveer clerical roles. Bilingual.",
      category: "Defence",
    },
    {
      name: "Supreme Court of India (SCI)",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Junior Court Assistant. Bilingual.",
      category: "Judicial",
    },
    {
      name: "NTPC",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Clerical posts. Bilingual.",
      category: "PSU",
    },
    {
      name: "AIIMS CRE",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Clerical posts. Bilingual.",
      category: "National",
    },
    {
      name: "DRDO",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "English typing only.",
      category: "Defence",
    },
    {
      name: "ESIC",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "UDC, MTS. English focus.",
      category: "National",
    },
    {
      name: "Indian Air Force",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "English typing only.",
      category: "Defence",
    },
    {
      name: "CRPF",
      englishWPM: null,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Head Constable. Hindi mandatory.",
      category: "Defence",
    },
    {
      name: "CISF",
      englishWPM: null,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Hindi typing emphasized.",
      category: "Defence",
    },
    {
      name: "FCI",
      englishWPM: null,
      hindiWPM: 30,
      fonts: ["Mangal", "Krutidev"],
      details: "Typist. Hindi focus.",
      category: "National",
    },
    {
      name: "SPMCIL",
      englishWPM: null,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Typist. Hindi prioritized.",
      category: "PSU",
    },
    {
      name: "IBPS Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bank-specific test. Bilingual optional.",
      category: "Banking",
    },
    {
      name: "India Post GDS to MTS/PA",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Postal Assistant. Bilingual.",
      category: "National",
    },
    {
      name: "KVS",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal", "Krutidev"],
      details: "LDC, UDC. Bilingual.",
      category: "National",
    },
    {
      name: "NVS",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Junior Assistant. Bilingual.",
      category: "National",
    },
    {
      name: "ONGC",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Junior Assistant. Bilingual.",
      category: "PSU",
    },
    {
      name: "IOCL",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Office Assistant. Bilingual.",
      category: "PSU",
    },
    {
      name: "GAIL",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Junior Assistant. Bilingual.",
      category: "PSU",
    },
    {
      name: "NHAI",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Junior Assistant. Bilingual.",
      category: "PSU",
    },
    {
      name: "ITI Limited",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Clerical posts. Bilingual.",
      category: "PSU",
    },
    {
      name: "ISRO",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Admin Assistant. English only.",
      category: "PSU",
    },
    {
      name: "BARC",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "UDC. English only.",
      category: "PSU",
    },
    {
      name: "ECIL",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Junior Technician. English only.",
      category: "PSU",
    },
    {
      name: "ITBP",
      englishWPM: null,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Head Constable. Hindi mandatory.",
      category: "Defence",
    },
    {
      name: "SSB",
      englishWPM: null,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Head Constable. Hindi focus.",
      category: "Defence",
    },
    {
      name: "BRO",
      englishWPM: null,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Typist. Hindi prioritized.",
      category: "Defence",
    },
    {
      name: "SSC Stenographer",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal", "Krutidev"],
      details: "Typing and shorthand. Bilingual.",
      category: "National",
    },
    {
      name: "SSC MTS",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Clerical posts. Bilingual.",
      category: "National",
    },
    {
      name: "SSC JE",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Office staff. English only.",
      category: "National",
    },
    {
      name: "SSC GD Constable",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Clerical support. Bilingual.",
      category: "National",
    },
    {
      name: "RRB Group D",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Clerical promotions. Bilingual.",
      category: "Railway",
    },
    {
      name: "RRB JE",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Admin roles. English only.",
      category: "Railway",
    },
    {
      name: "RRB ALP",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Office staff. English only.",
      category: "Railway",
    },
    {
      name: "RPF Constable",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Clerical duties. Bilingual.",
      category: "Railway",
    },
    {
      name: "EPFO SSA",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "English focus.",
      category: "National",
    },
    {
      name: "Indian Navy SSR",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Clerical roles. English only.",
      category: "Defence",
    },
    {
      name: "NDA",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Admin staff. English only.",
      category: "Defence",
    },
    {
      name: "CDS",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Clerical support. English only.",
      category: "Defence",
    },
    {
      name: "SAIL",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Typist. Bilingual.",
      category: "PSU",
    },
    {
      name: "BHEL",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Clerk. English only.",
      category: "PSU",
    },
    {
      name: "HAL",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Typist. English only.",
      category: "PSU",
    },
    {
      name: "BEL",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Clerk. English only.",
      category: "PSU",
    },
    {
      name: "HPCL",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Office Assistant. Bilingual.",
      category: "PSU",
    },
    {
      name: "BPCL",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "Typist. English only.",
      category: "PSU",
    },
    {
      name: "Coal India Limited",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Clerk. Bilingual.",
      category: "PSU",
    },
    {
      name: "SBI Clerk",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "English focus.",
      category: "Banking",
    },
    {
      name: "RRB Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Regional Rural Banks. Bilingual.",
      category: "Banking",
    },
    {
      name: "LIC AAO",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "English focus.",
      category: "Banking",
    },
    {
      name: "NIACL AO",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "English focus.",
      category: "Banking",
    },
    {
      name: "IDBI Executive",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "English focus.",
      category: "Banking",
    },
    {
      name: "Jute Corporation of India",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Junior Assistant. Bilingual.",
      category: "PSU",
    },
    {
      name: "NTA Visva Bharati",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Typist. Bilingual.",
      category: "National",
    },
    {
      name: "EMRS JSA",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Junior Secretariat Assistant. Bilingual.",
      category: "National",
    },
    {
      name: "IGNOU",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Junior Assistant. Bilingual.",
      category: "National",
    },
    {
      name: "CUET Clerical",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "English focus.",
      category: "National",
    },
    {
      name: "MGCU",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Typist. Bilingual.",
      category: "National",
    },
    {
      name: "HPCU",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Clerk. Bilingual.",
      category: "National",
    },
    {
      name: "Census of India DEO",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Data Entry Operator. Bilingual.",
      category: "National",
    },
    {
      name: "Election Commission Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Clerk. Bilingual.",
      category: "National",
    },
    {
      name: "NIC DEO",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Data Entry Operator. Bilingual.",
      category: "National",
    },
    {
      name: "CSIR Clerk",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "English focus.",
      category: "National",
    },
  ];

  const regionalExams = [
    {
      name: "UPSSSC Junior Assistant",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal", "Krutidev"],
      details: "Hindi mandatory, English optional.",
      region: "Uttar Pradesh",
    },
    {
      name: "UPPSC RO/ARO",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Both languages tested.",
      region: "Uttar Pradesh",
    },
    {
      name: "UP Police Computer Operator",
      englishWPM: null,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Hindi mandatory.",
      region: "Uttar Pradesh",
    },
    {
      name: "UPRVUNL Office Assistant",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev", "Mangal"],
      details: "Hindi mandatory.",
      region: "Uttar Pradesh",
    },
    {
      name: "RSSB/RSMSSB LDC",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev"],
      details: "Hindi emphasized.",
      region: "Rajasthan",
    },
    {
      name: "Rajasthan High Court Typist",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev"],
      details: "Hindi and English.",
      region: "Rajasthan",
    },
    {
      name: "MPPSC Assistant Grade III",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Hindi focus.",
      region: "Madhya Pradesh",
    },
    {
      name: "CPCT (MP)",
      englishWPM: 30,
      hindiWPM: 25,
      fonts: ["Mangal"],
      details: "Bilingual focus.",
      region: "Madhya Pradesh",
    },
    {
      name: "BSSC Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev"],
      details: "Hindi prioritized.",
      region: "Bihar",
    },
    {
      name: "Bihar Vidhan Sabha DEO",
      englishWPM: 30,
      hindiWPM: 25,
      fonts: ["Krutidev"],
      details: "Hindi mandatory.",
      region: "Bihar",
    },
    {
      name: "Beltron DEO",
      englishWPM: 30,
      hindiWPM: 25,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Bihar",
    },
    {
      name: "DSSSB Junior Assistant",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual requirement.",
      region: "Delhi",
    },
    {
      name: "Delhi High Court JJA",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Delhi",
    },
    {
      name: "HSSC Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Haryana",
    },
    {
      name: "PSSSB Clerk",
      englishWPM: 35,
      punjabiWPM: 30,
      fonts: ["Gurmukhi"],
      details: "Punjabi focus.",
      region: "Punjab",
    },
    {
      name: "Punjab and Haryana High Court Typist",
      englishWPM: 35,
      punjabiWPM: 30,
      fonts: ["Gurmukhi"],
      details: "Punjabi/Hindi optional.",
      region: "Punjab",
    },
    {
      name: "HPSSSB JOA",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Himachal Pradesh",
    },
    {
      name: "JSSC Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev"],
      details: "Hindi prioritized.",
      region: "Jharkhand",
    },
    {
      name: "Jharkhand High Court Assistant",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev"],
      details: "Bilingual.",
      region: "Jharkhand",
    },
    {
      name: "CGPSC Assistant Grade III",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Hindi focus.",
      region: "Chhattisgarh",
    },
    {
      name: "UKPSC/UKSSSC Junior Assistant",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Uttarakhand",
    },
    {
      name: "OSSC Junior Clerk",
      englishWPM: 35,
      odiaWPM: 30,
      fonts: ["Unicode"],
      details: "Odia focus.",
      region: "Odisha",
    },
    {
      name: "Odisha High Court Typist",
      englishWPM: 35,
      odiaWPM: 30,
      fonts: ["Unicode"],
      details: "Odia optional.",
      region: "Odisha",
    },
    {
      name: "WBPSC Clerkship",
      englishWPM: 35,
      bengaliWPM: 30,
      fonts: ["Unicode"],
      details: "Bengali focus.",
      region: "West Bengal",
    },
    {
      name: "Calcutta High Court LDC",
      englishWPM: 35,
      bengaliWPM: 30,
      fonts: ["Unicode"],
      details: "Bengali optional.",
      region: "West Bengal",
    },
    {
      name: "APPSC Group IV",
      englishWPM: 35,
      teluguWPM: 30,
      fonts: ["Unicode"],
      details: "Telugu focus.",
      region: "Andhra Pradesh",
    },
    {
      name: "AP High Court Typist",
      englishWPM: 35,
      teluguWPM: 30,
      fonts: ["Unicode"],
      details: "Telugu optional.",
      region: "Andhra Pradesh",
    },
    {
      name: "TSPSC Junior Assistant",
      englishWPM: 35,
      teluguWPM: 30,
      fonts: ["Unicode"],
      details: "Telugu focus.",
      region: "Telangana",
    },
    {
      name: "Telangana High Court Typist",
      englishWPM: 35,
      teluguWPM: 30,
      fonts: ["Unicode"],
      details: "Telugu focus.",
      region: "Telangana",
    },
    {
      name: "KPSC Typist",
      englishWPM: 35,
      kannadaWPM: 30,
      fonts: ["Nudi"],
      details: "Kannada focus.",
      region: "Karnataka",
    },
    {
      name: "Karnataka High Court Clerk",
      englishWPM: 35,
      kannadaWPM: 30,
      fonts: ["Nudi"],
      details: "Kannada optional.",
      region: "Karnataka",
    },
    {
      name: "TNPSC Typist",
      englishWPM: 35,
      tamilWPM: 30,
      fonts: ["TAM"],
      details: "Tamil focus.",
      region: "Tamil Nadu",
    },
    {
      name: "Madras High Court Clerk",
      englishWPM: 35,
      tamilWPM: 30,
      fonts: ["TAM"],
      details: "Tamil optional.",
      region: "Tamil Nadu",
    },
    {
      name: "Kerala PSC Typist",
      englishWPM: 35,
      malayalamWPM: 30,
      fonts: ["Unicode"],
      details: "Malayalam focus.",
      region: "Kerala",
    },
    {
      name: "Kerala High Court Clerk",
      englishWPM: 35,
      malayalamWPM: 30,
      fonts: ["Unicode"],
      details: "Malayalam optional.",
      region: "Kerala",
    },
    {
      name: "MPSC Clerk-Typist",
      englishWPM: 35,
      marathiWPM: 30,
      fonts: ["Unicode"],
      details: "Marathi focus.",
      region: "Maharashtra",
    },
    {
      name: "Bombay High Court Clerk",
      englishWPM: 35,
      marathiWPM: 30,
      fonts: ["Unicode"],
      details: "Marathi optional.",
      region: "Maharashtra",
    },
    {
      name: "GPSC Clerk",
      englishWPM: 35,
      gujaratiWPM: 30,
      fonts: ["Unicode"],
      details: "Gujarati focus.",
      region: "Gujarat",
    },
    {
      name: "Gujarat High Court Typist",
      englishWPM: 35,
      gujaratiWPM: 30,
      fonts: ["Unicode"],
      details: "Gujarati optional.",
      region: "Gujarat",
    },
    {
      name: "APSC Junior Assistant",
      englishWPM: 35,
      assameseWPM: 30,
      fonts: ["Unicode"],
      details: "Assamese focus.",
      region: "Assam",
    },
    {
      name: "Gauhati High Court Clerk",
      englishWPM: 35,
      assameseWPM: 30,
      fonts: ["Unicode"],
      details: "Assamese optional.",
      region: "Assam",
    },
    {
      name: "Manipur PSC Clerk",
      englishWPM: 35,
      manipuriWPM: 30,
      fonts: ["Meitei Mayek"],
      details: "Manipuri optional.",
      region: "Northeast",
    },
    {
      name: "Tripura PSC Typist",
      englishWPM: 35,
      bengaliWPM: 30,
      fonts: ["Unicode"],
      details: "Bengali/Kokborok optional.",
      region: "Northeast",
    },
    {
      name: "Meghalaya SSC Clerk",
      englishWPM: 35,
      khasiWPM: 30,
      fonts: ["Unicode"],
      details: "Khasi/Garo optional.",
      region: "Northeast",
    },
    {
      name: "Nagaland PSC Clerk",
      englishWPM: 35,
      hindiWPM: null,
      fonts: [],
      details: "English only.",
      region: "Northeast",
    },
    {
      name: "JKSSB Junior Assistant",
      englishWPM: 35,
      urduWPM: 30,
      fonts: ["Unicode"],
      details: "Urdu focus.",
      region: "Jammu & Kashmir",
    },
    {
      name: "J&K High Court Typist",
      englishWPM: 35,
      urduWPM: 30,
      fonts: ["Unicode"],
      details: "Urdu optional.",
      region: "Jammu & Kashmir",
    },
    {
      name: "Goa PSC Clerk",
      englishWPM: 35,
      konkaniWPM: 30,
      fonts: ["Unicode"],
      details: "Konkani focus.",
      region: "Goa",
    },
    {
      name: "Lucknow District Court Typist",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Uttar Pradesh",
    },
    {
      name: "Kanpur Municipal Corporation DEO",
      englishWPM: 30,
      hindiWPM: 25,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Uttar Pradesh",
    },
    {
      name: "Varanasi Zila Panchayat Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Uttar Pradesh",
    },
    {
      name: "Jaipur District Court LDC",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev"],
      details: "Bilingual.",
      region: "Rajasthan",
    },
    {
      name: "Jodhpur Municipal Corporation Typist",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev"],
      details: "Bilingual.",
      region: "Rajasthan",
    },
    {
      name: "Bhopal District Court Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Madhya Pradesh",
    },
    {
      name: "Indore Municipal Corporation DEO",
      englishWPM: 30,
      hindiWPM: 25,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Madhya Pradesh",
    },
    {
      name: "Patna District Court Typist",
      englishWPM: 30,
      hindiWPM: 25,
      fonts: ["Krutidev"],
      details: "Bilingual.",
      region: "Bihar",
    },
    {
      name: "Muzaffarpur Municipal Corporation Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev"],
      details: "Bilingual.",
      region: "Bihar",
    },
    {
      name: "East Delhi Municipal Corporation Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Delhi",
    },
    {
      name: "South Delhi Municipal Corporation DEO",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Delhi",
    },
    {
      name: "Gurugram Municipal Corporation Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Haryana",
    },
    {
      name: "Faridabad Zila Parishad DEO",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Haryana",
    },
    {
      name: "Amritsar District Court Typist",
      englishWPM: 35,
      punjabiWPM: 30,
      fonts: ["Gurmukhi"],
      details: "Punjabi focus.",
      region: "Punjab",
    },
    {
      name: "Ludhiana Municipal Corporation DEO",
      englishWPM: 35,
      punjabiWPM: 30,
      fonts: ["Gurmukhi"],
      details: "Punjabi optional.",
      region: "Punjab",
    },
    {
      name: "Ranchi District Court Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev"],
      details: "Bilingual.",
      region: "Jharkhand",
    },
    {
      name: "Jamshedpur Municipal Corporation Typist",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Krutidev"],
      details: "Bilingual.",
      region: "Jharkhand",
    },
    {
      name: "Raipur District Court Typist",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Chhattisgarh",
    },
    {
      name: "Bilaspur Municipal Corporation Clerk",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Bilingual.",
      region: "Chhattisgarh",
    },
    {
      name: "Bhubaneswar District Court Clerk",
      englishWPM: 35,
      odiaWPM: 30,
      fonts: ["Unicode"],
      details: "Odia focus.",
      region: "Odisha",
    },
    {
      name: "Cuttack Municipal Corporation DEO",
      englishWPM: 35,
      odiaWPM: 30,
      fonts: ["Unicode"],
      details: "Odia optional.",
      region: "Odisha",
    },
    {
      name: "Kolkata Municipal Corporation Clerk",
      englishWPM: 35,
      bengaliWPM: 30,
      fonts: ["Unicode"],
      details: "Bengali focus.",
      region: "West Bengal",
    },
    {
      name: "Howrah District Court Typist",
      englishWPM: 35,
      bengaliWPM: 30,
      fonts: ["Unicode"],
      details: "Bengali optional.",
      region: "West Bengal",
    },
    {
      name: "Visakhapatnam District Court Clerk",
      englishWPM: 35,
      teluguWPM: 30,
      fonts: ["Unicode"],
      details: "Telugu focus.",
      region: "Andhra Pradesh",
    },
    {
      name: "Vijayawada Municipal Corporation DEO",
      englishWPM: 35,
      teluguWPM: 30,
      fonts: ["Unicode"],
      details: "Telugu optional.",
      region: "Andhra Pradesh",
    },
    {
      name: "Hyderabad District Court Typist",
      englishWPM: 35,
      teluguWPM: 30,
      fonts: ["Unicode"],
      details: "Telugu focus.",
      region: "Telangana",
    },
    {
      name: "Warangal Municipal Corporation Clerk",
      englishWPM: 35,
      teluguWPM: 30,
      fonts: ["Unicode"],
      details: "Telugu optional.",
      region: "Telangana",
    },
    {
      name: "Bengaluru District Court Clerk",
      englishWPM: 35,
      kannadaWPM: 30,
      fonts: ["Nudi"],
      details: "Kannada focus.",
      region: "Karnataka",
    },
    {
      name: "Mysuru Municipal Corporation DEO",
      englishWPM: 35,
      kannadaWPM: 30,
      fonts: ["Nudi"],
      details: "Kannada optional.",
      region: "Karnataka",
    },
    {
      name: "Chennai District Court Typist",
      englishWPM: 35,
      tamilWPM: 30,
      fonts: ["TAM"],
      details: "Tamil focus.",
      region: "Tamil Nadu",
    },
    {
      name: "Coimbatore Municipal Corporation Clerk",
      englishWPM: 35,
      tamilWPM: 30,
      fonts: ["TAM"],
      details: "Tamil optional.",
      region: "Tamil Nadu",
    },
    {
      name: "Thiruvananthapuram District Court Clerk",
      englishWPM: 35,
      malayalamWPM: 30,
      fonts: ["Unicode"],
      details: "Malayalam focus.",
      region: "Kerala",
    },
    {
      name: "Kochi Municipal Corporation DEO",
      englishWPM: 35,
      malayalamWPM: 30,
      fonts: ["Unicode"],
      details: "Malayalam optional.",
      region: "Kerala",
    },
    {
      name: "Guwahati District Court Clerk",
      englishWPM: 35,
      assameseWPM: 30,
      fonts: ["Unicode"],
      details: "Assamese focus.",
      region: "Assam",
    },
    {
      name: "Dibrugarh Municipal Corporation Typist",
      englishWPM: 35,
      assameseWPM: 30,
      fonts: ["Unicode"],
      details: "Assamese optional.",
      region: "Assam",
    },
    {
      name: "Srinagar District Court Clerk",
      englishWPM: 35,
      urduWPM: 30,
      fonts: ["Unicode"],
      details: "Urdu focus.",
      region: "Jammu & Kashmir",
    },
    {
      name: "Jammu Municipal Corporation DEO",
      englishWPM: 35,
      urduWPM: 30,
      fonts: ["Unicode"],
      details: "Urdu optional.",
      region: "Jammu & Kashmir",
    },
    {
      name: "Panaji District Court Typist",
      englishWPM: 35,
      konkaniWPM: 30,
      fonts: ["Unicode"],
      details: "Konkani focus.",
      region: "Goa",
    },
    {
      name: "DDA ASO/JSA",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Assistant Section Officer. Bilingual.",
      region: "Delhi",
    },
    {
      name: "Delhi Jal Board",
      englishWPM: 35,
      hindiWPM: 30,
      fonts: ["Mangal"],
      details: "Junior Assistant. Bilingual.",
      region: "Delhi",
    },
    {
      name: "Mumbai BMC Clerk",
      englishWPM: 35,
      marathiWPM: 30,
      fonts: ["Unicode"],
      details: "Marathi focus.",
      region: "Maharashtra",
    },
    {
      name: "Pune District Court Typist",
      englishWPM: 35,
      marathiWPM: 30,
      fonts: ["Unicode"],
      details: "Marathi optional.",
      region: "Maharashtra",
    },
    {
      name: "Ahmedabad District Court Clerk",
      englishWPM: 35,
      gujaratiWPM: 30,
      fonts: ["Unicode"],
      details: "Gujarati focus.",
      region: "Gujarat",
    },
    {
      name: "Surat Municipal Corporation DEO",
      englishWPM: 35,
      gujaratiWPM: 30,
      fonts: ["Unicode"],
      details: "Gujarati optional.",
      region: "Gujarat",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [fontFilter, setFontFilter] = useState("All");

  const filterExams = (examList) =>
    examList.filter((exam) => {
      const matchesSearch = exam.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesLanguage =
        languageFilter === "All" ||
        (languageFilter === "English" && exam.englishWPM) ||
        (languageFilter === "Hindi" && exam.hindiWPM) ||
        (languageFilter === "Punjabi" && exam.punjabiWPM) ||
        (languageFilter === "Odia" && exam.odiaWPM) ||
        (languageFilter === "Bengali" && exam.bengaliWPM) ||
        (languageFilter === "Telugu" && exam.teluguWPM) ||
        (languageFilter === "Kannada" && exam.kannadaWPM) ||
        (languageFilter === "Tamil" && exam.tamilWPM) ||
        (languageFilter === "Malayalam" && exam.malayalamWPM) ||
        (languageFilter === "Marathi" && exam.marathiWPM) ||
        (languageFilter === "Gujarati" && exam.gujaratiWPM) ||
        (languageFilter === "Assamese" && exam.assameseWPM) ||
        (languageFilter === "Manipuri" && exam.manipuriWPM) ||
        (languageFilter === "Khasi" && exam.khasiWPM) ||
        (languageFilter === "Urdu" && exam.urduWPM) ||
        (languageFilter === "Konkani" && exam.konkaniWPM);
      const matchesFont =
        fontFilter === "All" || exam.fonts.includes(fontFilter);
      return matchesSearch && matchesLanguage && matchesFont;
    });

  const filteredNationalExams = filterExams(nationalExams);
  const filteredRegionalExams = filterExams(regionalExams);

  const handleCardClick = (exam) => {
    const availableLanguages = [];
    if (exam.englishWPM) availableLanguages.push("english");
    if (exam.hindiWPM) availableLanguages.push("hindi");
    if (exam.punjabiWPM) availableLanguages.push("punjabi");
    if (exam.odiaWPM) availableLanguages.push("odia");
    if (exam.bengaliWPM) availableLanguages.push("bengali");
    if (exam.teluguWPM) availableLanguages.push("telugu");
    if (exam.kannadaWPM) availableLanguages.push("kannada");
    if (exam.tamilWPM) availableLanguages.push("tamil");
    if (exam.malayalamWPM) availableLanguages.push("malayalam");
    if (exam.marathiWPM) availableLanguages.push("marathi");
    if (exam.gujaratiWPM) availableLanguages.push("gujarati");
    if (exam.assameseWPM) availableLanguages.push("assamese");
    if (exam.manipuriWPM) availableLanguages.push("manipuri");
    if (exam.khasiWPM) availableLanguages.push("khasi");
    if (exam.urduWPM) availableLanguages.push("urdu");
    if (exam.konkaniWPM) availableLanguages.push("konkani");

    const defaultLanguage = availableLanguages.includes(
      languageFilter.toLowerCase()
    )
      ? languageFilter.toLowerCase()
      : availableLanguages[0] || "english";
    const wpm =
      defaultLanguage === "english"
        ? exam.englishWPM
        : defaultLanguage === "hindi"
        ? exam.hindiWPM
        : defaultLanguage === "punjabi"
        ? exam.punjabiWPM
        : defaultLanguage === "odia"
        ? exam.odiaWPM
        : defaultLanguage === "bengali"
        ? exam.bengaliWPM
        : defaultLanguage === "telugu"
        ? exam.teluguWPM
        : defaultLanguage === "kannada"
        ? exam.kannadaWPM
        : defaultLanguage === "tamil"
        ? exam.tamilWPM
        : defaultLanguage === "malayalam"
        ? exam.malayalamWPM
        : defaultLanguage === "marathi"
        ? exam.marathiWPM
        : defaultLanguage === "gujarati"
        ? exam.gujaratiWPM
        : defaultLanguage === "assamese"
        ? exam.assameseWPM
        : defaultLanguage === "manipuri"
        ? exam.manipuriWPM
        : defaultLanguage === "khasi"
        ? exam.khasiWPM
        : defaultLanguage === "urdu"
        ? exam.urduWPM
        : defaultLanguage === "konkani"
        ? exam.konkaniWPM
        : 35;
    const font =
      fontFilter === "All" && exam.fonts.length > 0
        ? exam.fonts[0]
        : fontFilter;

    navigate(
      `/select-language?exam=${exam.name
        .toLowerCase()
        .replace(/\s+/g, "-")}&availableLanguages=${availableLanguages.join(
        ","
      )}&wpm=${wpm}&font=${font}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col items-center py-12 px-4 relative">
      <CustomCursor />
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-500"
      >
        Typing Exam Preparation Hub
      </motion.h1>
      <p className="text-gray-300 mb-8 text-center max-w-2xl">
        Prepare for National and Regional typing tests with English, Hindi, and
        regional languages. Select your preferences below.
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-lg mb-8"
      >
        <input
          type="text"
          placeholder="Search exams (e.g., SSC CHSL, UPSSSC)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-blue-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 mb-12"
      >
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="p-2 bg-gray-800 border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="All">All Languages</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Odia">Odia</option>
          <option value="Bengali">Bengali</option>
          <option value="Telugu">Telugu</option>
          <option value="Kannada">Kannada</option>
          <option value="Tamil">Tamil</option>
          <option value="Malayalam">Malayalam</option>
          <option value="Marathi">Marathi</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Assamese">Assamese</option>
          <option value="Manipuri">Manipuri</option>
          <option value="Khasi">Khasi</option>
          <option value="Urdu">Urdu</option>
          <option value="Konkani">Konkani</option>
        </select>
        <select
          value={fontFilter}
          onChange={(e) => setFontFilter(e.target.value)}
          className="p-2 bg-gray-800 border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="All">Default Font</option>
          <option value="Mangal">Mangal</option>
          <option value="Krutidev">Krutidev</option>
          <option value="Devlys">Devlys</option>
          <option value="Unicode">Unicode</option>
          <option value="Gurmukhi">Gurmukhi</option>
          <option value="Nudi">Nudi</option>
          <option value="TAM">TAM</option>
          <option value="Meitei Mayek">Meitei Mayek</option>
        </select>
      </motion.div>

      <div className="w-full max-w-7xl mb-12">
        <h2 className="text-3xl font-semibold text-orange-400 mb-6">
          National Exams
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNationalExams.length > 0 ? (
            filteredNationalExams.map((exam, index) => (
              <motion.div
                key={exam.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255, 165, 0, 0.5)",
                }}
                onClick={() => handleCardClick(exam)}
                className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-xl p-6 border border-orange-500 flex flex-col items-center text-center shadow-lg hover:bg-opacity-90 transition-all duration-300 relative cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-orange-400 mb-2">
                  {exam.name}
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  {exam.englishWPM && `English: ${exam.englishWPM} WPM`}
                  {exam.englishWPM && exam.hindiWPM && " | "}
                  {exam.hindiWPM && `Hindi: ${exam.hindiWPM} WPM`}
                  <br />
                  Fonts: {exam.fonts.length > 0 ? exam.fonts.join(", ") : "N/A"}
                </p>
                <p className="text-gray-400 text-xs">{exam.details}</p>
                <div className="absolute inset-0 rounded-xl border border-blue-500 opacity-50 pointer-events-none animate-pulse"></div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center">
              No national exams found.
            </p>
          )}
        </div>
      </div>

      <div className="w-full max-w-7xl">
        <h2 className="text-3xl font-semibold text-orange-400 mb-6">
          Regional Exams
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRegionalExams.length > 0 ? (
            filteredRegionalExams.map((exam, index) => (
              <motion.div
                key={exam.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255, 165, 0, 0.5)",
                }}
                onClick={() => handleCardClick(exam)}
                className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-xl p-6 border border-orange-500 flex flex-col items-center text-center shadow-lg hover:bg-opacity-90 transition-all duration-300 relative cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-orange-400 mb-2">
                  {exam.name}
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  {exam.englishWPM && `English: ${exam.englishWPM} WPM`}
                  {exam.englishWPM &&
                    (exam.hindiWPM ||
                      exam.punjabiWPM ||
                      exam.odiaWPM ||
                      exam.bengaliWPM ||
                      exam.teluguWPM ||
                      exam.kannadaWPM ||
                      exam.tamilWPM ||
                      exam.malayalamWPM ||
                      exam.marathiWPM ||
                      exam.gujaratiWPM ||
                      exam.assameseWPM ||
                      exam.manipuriWPM ||
                      exam.khasiWPM ||
                      exam.urduWPM ||
                      exam.konkaniWPM) &&
                    " | "}
                  {exam.hindiWPM && `Hindi: ${exam.hindiWPM} WPM`}
                  {exam.punjabiWPM && `Punjabi: ${exam.punjabiWPM} WPM`}
                  {exam.odiaWPM && `Odia: ${exam.odiaWPM} WPM`}
                  {exam.bengaliWPM && `Bengali: ${exam.bengaliWPM} WPM`}
                  {exam.teluguWPM && `Telugu: ${exam.teluguWPM} WPM`}
                  {exam.kannadaWPM && `Kannada: ${exam.kannadaWPM} WPM`}
                  {exam.tamilWPM && `Tamil: ${exam.tamilWPM} WPM`}
                  {exam.malayalamWPM && `Malayalam: ${exam.malayalamWPM} WPM`}
                  {exam.marathiWPM && `Marathi: ${exam.marathiWPM} WPM`}
                  {exam.gujaratiWPM && `Gujarati: ${exam.gujaratiWPM} WPM`}
                  {exam.assameseWPM && `Assamese: ${exam.assameseWPM} WPM`}
                  {exam.manipuriWPM && `Manipuri: ${exam.manipuriWPM} WPM`}
                  {exam.khasiWPM && `Khasi: ${exam.khasiWPM} WPM`}
                  {exam.urduWPM && `Urdu: ${exam.urduWPM} WPM`}
                  {exam.konkaniWPM && `Konkani: ${exam.konkaniWPM} WPM`}
                  <br />
                  Fonts: {exam.fonts.length > 0 ? exam.fonts.join(", ") : "N/A"}
                </p>
                <p className="text-gray-400 text-xs mb-2">{exam.details}</p>
                <p className="text-blue-400 text-xs">{exam.region}</p>
                <div className="absolute inset-0 rounded-xl border border-blue-500 opacity-50 pointer-events-none animate-pulse"></div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center">
              No regional exams found.
            </p>
          )}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default ExamPage;
