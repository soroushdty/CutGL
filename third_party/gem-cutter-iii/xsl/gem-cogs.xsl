<xsl:stylesheet version="1.0" xmlns:gem="http://gem.yale.edu"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output media-type="html"/>

	<xsl:strip-space elements="gem:*"/>

	<xsl:template match="/">
		<html>
			<head>
				<style>
                   
td.headertext { font-style: italic; font-size: 10px; font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular; text-decoration: none ; background-color: #ffe886}
td.bodytext { border-width: 1px;border-style: solid;border-color:  #cccccc;font-style: normal; font-size: 10px; font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular; text-decoration: none }
td.condbodytext { font-style: normal; font-size: 10px; font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular; text-decoration: none;background-color: #c1ff05 }
td.headerboldmain  { font-style: normal; font-weight: bold; font-size: 12px; font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular; text-decoration: none; background-color: #ffd046 }
td.rowheader { border-width: 1px;border-style: solid;border-color:  #cccccc;font-style: italic; font-size: 10px; font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular; text-decoration: none }
td.condrowheader { font-style: italic; font-size: 10px; font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular; text-decoration: none;background-color: #c1ff05 }
.headermain  { font-style: normal; font-size: 10px; font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular; text-decoration: none }
td.improwheader { font-style: italic; font-size: 10px; font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular; text-decoration: none;background-color: #c1ff05 }
td.impbodytext { font-style: normal; font-size: 10px; font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular; text-decoration: none;background-color: #c1ff05 }
table.main{ border-width: 2px;border-style: solid;border-color:  #000000; border-spacing: 0px;border-style: solid;border-color:  #000000;}
.title {font-style: normal; font-weight: bold; font-size: 16px; font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular; text-decoration: none;  }
                </style>
			</head>
			<body>
				<div width="600px" class="title" align="center">
					<xsl:value-of select="/gem:GuidelineDocument/gem:Identity/gem:GuidelineTitle/text()"/>
				</div>
			
				<table width="600px" class="main">

					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(1)</div>
							<div align="center">Overview material</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Provide a structured abstract that includes
							the guideline's release date, status (original, revised, updated),
							and print and electronic sources.</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Release Date</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<div align="left">
								<xsl:choose>
									<xsl:when
										test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:ReleaseDate/node())">
										<xsl:for-each select="//gem:ReleaseDate">
											<xsl:value-of select="."/>
										</xsl:for-each>
									</xsl:when>
									<xsl:otherwise>
										<B>
											<font color="red">Empty</font>
										</B>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Status</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:Status/node())">
									<xsl:for-each select="//gem:Status">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Available in Electronic Format</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:Availability/gem:Electronic/node())">
									<xsl:for-each select="//gem:Electronic">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Available in Print Format</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:Availability/gem:Print/node())">
									<xsl:for-each select="//gem:Print">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Bibliographic citation</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:Citation/node())">
									<xsl:for-each select="//gem:Citation">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Contact Information</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:Availability/gem:Contact/node())">
									<xsl:for-each select="//gem:Contact">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Adapted From Another Guideline</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:Adaptation/node())">
									<xsl:for-each select="//gem:Adaptation">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(2)</div>
							<div align="center">Focus</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe the primary disease/condition and
							intervention/ service/ technology that the guideline addresses.
							Indicate any alternative preventive, diagnostic or therapeutic
							interventions that were considered during development.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Primary disease or condition</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<div align="left">
								<xsl:choose>
									<xsl:when
										test="normalize-space(/gem:GuidelineDocument/gem:Purpose/gem:MainFocus/node())">
										<xsl:for-each select="//gem:MainFocus">
											<xsl:value-of select="."/>
										</xsl:for-each>
									</xsl:when>
									<xsl:otherwise>
										<B>
											<font color="red">Empty</font>
										</B>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Alternative Strategies Available</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Purpose/gem:AvailableOption/node())">
									<xsl:for-each select="//gem:AvailableOption">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Comparable Guideline</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Developer/gem:ComparableGuideline/node())">
									<xsl:for-each select="//gem:ComparableGuideline">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext"/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(3)</div>
							<div align="center">Goal</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe the goal that following the
							guideline is expected to achieve, including the rationale for
							development of a guideline on this topic.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Goal</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<div align="left">
								<xsl:choose>
									<xsl:when
										test="normalize-space(/gem:GuidelineDocument/gem:Purpose/gem:Objective/node())">
										<xsl:for-each select="//gem:Objective">
											<xsl:value-of select="."/>
										</xsl:for-each>
									</xsl:when>
									<xsl:otherwise>
										<B>
											<font color="red">Empty</font>
										</B>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Rationale</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Purpose/gem:Rationale/node())">
									<xsl:for-each select="//gem:Rationale">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Outcomes or Performance Measures Considered</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<div align="left">
								<xsl:choose>
									<xsl:when
										test="normalize-space(/gem:GuidelineDocument/gem:Purpose/gem:HealthOutcome/node())">
										<xsl:for-each select="//gem:HealthOutcome">
											<xsl:value-of select="."/>
										</xsl:for-each>
									</xsl:when>
									<xsl:otherwise>
										<B>
											<font color="red">Empty</font>
										</B>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(4)</div>
							<div align="center">Users/Setting</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe the intended users of the guideline
							(e.g., provider types, patients) and the settings in which the
							guideline is intended to be used.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Users</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<div align="left">
								<xsl:choose>
									<xsl:when
										test="normalize-space(/gem:GuidelineDocument/gem:IntendedAudience/gem:Users/node())">
										<xsl:for-each select="//gem:Users">
											<xsl:value-of select="."/>
										</xsl:for-each>
									</xsl:when>
									<xsl:otherwise>
										<B>
											<font color="red">Empty</font>
										</B>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Care Setting</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:IntendedAudience/gem:CareSetting/node())">
									<xsl:for-each select="//gem:CareSetting">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(5)</div>
							<div align="center">Target population</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe the patient population eligible for
							guideline recommendations and list any exclusion criteria.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Population Target</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<div align="left">
								<xsl:choose>
									<xsl:when
										test="normalize-space(/gem:GuidelineDocument/gem:TargetPopulation/node())">
										<xsl:for-each select="//gem:TargetPopulation">
											<xsl:value-of select="."/>
										</xsl:for-each>
									</xsl:when>
									<xsl:otherwise>
										<B>
											<font color="red">Empty</font>
										</B>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Eligibility</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:TargetPopulation/gem:Eligibility/node())">
									<xsl:for-each select="//gem:Eligibility">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Inclusion criteria</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:TargetPopulation/gem:Eligibility/gem:InclusionCriterion/node())">
									<xsl:for-each select="//gem:InclusionCriterion">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Exclusion criteria</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:TargetPopulation/gem:Eligibility/gem:ExclusionCriterion/node())">
									<xsl:for-each select="//gem:ExclusionCriterion">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>

					
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(6)</div>
							<div align="center">Developer</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Identify the organization(s) responsible for
							guideline development and the names/credentials/potential
							conflicts of interest of individuals involved in the guideline's
							development.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Name of Developer </td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Developer/gem:DeveloperName/node())">
									<xsl:for-each select="//gem:DeveloperName">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Name of Committee</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Developer/gem:CommitteeName/node())">
									<xsl:for-each select="//gem:CommitteeName">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Committee Expertise</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Developer/gem:CommitteeName/gem:CommitteeExpertise/node())">
									<xsl:for-each select="//gem:CommitteeExpertise">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext"/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(7)</div>
							<div align="center">Funding source/sponsor</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Identify the funding source/sponsor and
							describe its role in developing, and/or reporting the guideline.
							Disclose potential conflict of interest.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Source of Funding</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Developer/gem:Funding/node())">
									<xsl:for-each select="//gem:Funding">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Name of Developer </td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Developer/gem:DeveloperName/node())">
									<xsl:for-each select="//gem:DeveloperName">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Role Of Sponsor</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Developer/gem:RoleOfSponsor/node())">
									<xsl:for-each select="//gem:RoleOfSponsor">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Conflict Of Interest </td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Developer/gem:ConflictOfInterest/node())">
									<xsl:for-each select="//gem:ConflictOfInterest">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(8)</div>
							<div align="center">Evidence collection</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe the methods used to search the
							scientific literature, including the range of dates and databases
							searched, and criteria applied to filter the retrieved evidence. </td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Description of Evidence Collection</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:DescriptionEvidenceCollection/node())">
									<xsl:for-each select="//gem:DescriptionEvidenceCollection">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Number of Source Documents</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:DescriptionEvidenceCollection/gem:NumberSourceDocuments/node())">
									<xsl:for-each select="//gem:NumberSourceDocuments">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Evidence Time Period</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:DescriptionEvidenceCollection/gem:EvidenceTimePeriod/node())">
									<xsl:for-each select="//gem:EvidenceTimePeriod">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Criteria for Selecting Evidence</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:DescriptionEvidenceCollection/gem:EvidenceSelectionCriteria/node())">
									<xsl:for-each select="//gem:EvidenceSelectionCriteria">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext"/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(9)</div>
							<div align="center">Recommendation grading criteria</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe the criteria used to rate the
							quality of evidence that supports the recommendations and the
							system for describing the strength of the recommendations.
							Recommendation strength communicates the importance of adherence
							to a recommendation and is based on both the quality of the
							evidence and the magnitude of anticipated benefits or harms.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Recommendation Grading Criteria</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:RatingScheme/node())">
									<xsl:for-each select="//gem:RatingScheme">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Evidence Quality Rating Scheme</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:RatingScheme/gem:EvidenceQualityRatingScheme/node())">
									<xsl:for-each select="//gem:EvidenceQualityRatingScheme">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Recommendation Strength Rating Scheme</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:RatingScheme/gem:RecommendationStrengthRatingScheme/node())">
									<xsl:for-each
										select="//gem:RecommendationStrengthRatingScheme">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(10)</div>
							<div align="center">Method for synthesizing evidence</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe how evidence was used to create
							recommendations, e.g., evidence tables, meta-analysis, decision
							analysis.</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Description of Evidence Combination</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:DescriptionEvidenceCombination/node())">
									<xsl:for-each select="//gem:DescriptionEvidenceCombination">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Methods To Reach Judgment</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:MethodsToReachJudgment/node())">
									<xsl:for-each select="//gem:MethodsToReachJudgment">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext"/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(11)</div>
							<div align="center">Pre-release review</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe how the guideline developer reviewed
							and/or tested the guidelines prior to release.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">External Review</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Testing/gem:ExternalReview/node())">
									<xsl:for-each select="//gem:ExternalReview">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Pilot testing</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Testing/gem:PilotTesting/node())">
									<xsl:for-each select="//gem:PilotTesting">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Formal Appraisal</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Testing/gem:FormalAppraisal/node())">
									<xsl:for-each select="//gem:FormalAppraisal">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(12)</div>
							<div align="center">Update plan</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">State whether or not there is a plan to
							update the guideline and, if applicable, an expiration date for
							this version of the guideline.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Expiration</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:RevisionPlan/gem:Expiration/node())">
									<xsl:for-each select="//gem:Expiration">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Scheduled Review</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:RevisionPlan/gem:ScheduledReview/node())">
									<xsl:for-each select="//gem:ScheduledReview">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext"/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(13)</div>
							<div align="center">Definitions</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Define unfamiliar terms and those critical to
							correct application of the guideline that might be subject to
							misinterpretation. </td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Definitions</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:Status/node())">
									<xsl:for-each select="//gem:Status">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Term - Meaning</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:for-each
								select="//gem:GuidelineDocument/gem:KnowledgeComponents/gem:Definition/gem:Term">
								<xsl:value-of select="./gem:TermMeaning/node()"/>
								<br/>
							</xsl:for-each>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(14)</div>
							<div align="center">Recommendations and rationale</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">State the recommended action precisely and
							the specific circumstances under which to perform it. Justify each
							recommendation by describing the linkage between the
							recommendation and its supporting evidence. Indicate the quality
							of evidence and the recommendation strength, based on the criteria
							described in 9.</td>
						<td/>
					</tr>
					

					<xsl:for-each
						select=" //gem:GuidelineDocument/gem:KnowledgeComponents/gem:Recommendation">
						<xsl:if test="normalize-space(./node())">
							<xsl:for-each select="gem:Conditional">
								<xsl:if test="normalize-space(./node())">
									<tr>
										<td class="condrowheader">Recommendation</td>
										<td>
											<div align="center"/>
										</td>
										<td class="condbodytext">
											<xsl:choose>
												<xsl:when test="normalize-space(./node())">
													<xsl:value-of select="../node()"/> - <i>Conditonal</i>
													- <xsl:value-of select="./node()"/>
												</xsl:when>
												<xsl:otherwise>
													<B>
														<font color="red">Empty</font>
													</B>
												</xsl:otherwise>
											</xsl:choose>
											<div align="left"/>
										</td>
										<td/>
									</tr>
									<xsl:for-each select="./gem:DecisionVariable">
										<tr>
											<td class="rowheader">Decision Variable</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<xsl:for-each select="./gem:Action">
										<tr>
											<td class="rowheader">Action</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<xsl:for-each select="./gem:Reference">
										<tr>
											<td class="rowheader">Reference</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<xsl:for-each select="./gem:Reason">
										<tr>
											<td class="rowheader">Reason</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<xsl:for-each select="./gem:RecommendationStrength">
										<tr>
											<td class="rowheader">Strength of Recommendation</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<xsl:for-each select="./gem:EvidenceQuality">
										<tr>
											<td class="rowheader">Quality of Evidence</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<tr>
										<td/>
										<td>
											<div align="center"/>
										</td>
										<td class="bodytext"/>
										<td/>
									</tr>
								</xsl:if>
							</xsl:for-each>
							<xsl:for-each select="gem:Imperative">
								<xsl:if test="normalize-space(./node())">
									<tr>
										<td class="improwheader">Recommendation</td>
										<td>
											<div align="center"/>
										</td>
										<td class="impbodytext">
											<xsl:choose>
												<xsl:when test="normalize-space(./node())">
													<xsl:value-of select="../node()"/> - <i>Imperative</i>
													- <xsl:value-of select="./node()"/>
												</xsl:when>
												<xsl:otherwise>
													<B>
														<font color="red">Empty</font>
													</B>
												</xsl:otherwise>
											</xsl:choose>
											<div align="left"/>
										</td>
										<td/>
									</tr>
									<xsl:for-each select="./gem:Directive">
										<tr>
											<td class="rowheader">Action</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<xsl:for-each select="./gem:Reference">
										<tr>
											<td class="rowheader">Reference</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<xsl:for-each select="./gem:Reason">
										<tr>
											<td class="rowheader">Reason</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<xsl:for-each select="./RecommendationStrength">
										<tr>
											<td class="rowheader">Strength of Recommendation</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<xsl:for-each select="./gem:EvidenceQuality">
										<tr>
											<td class="rowheader">Quality of Evidence</td>
											<td>
												<div align="center"/>
											</td>
											<td class="bodytext">
												<xsl:choose>
													<xsl:when test="normalize-space(./node())">
														<xsl:value-of select="./node()"/>
													</xsl:when>
													<xsl:otherwise>
														<B>
															<font color="red">Empty</font>
														</B>
													</xsl:otherwise>
												</xsl:choose>
											</td>
											<td/>
										</tr>
									</xsl:for-each>
									<tr>
										<td/>
										<td>
											<div align="center"/>
										</td>
										<td class="bodytext"/>
										<td/>
									</tr>
								</xsl:if>
							</xsl:for-each>
						</xsl:if>
					</xsl:for-each>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(15)</div>
							<div align="center">Potential benefits and harms</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe anticipated benefits and potential
							risks associated with implementation of guideline recommendations.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Health Outcomes</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Purpose/gem:HealthOutcome/node())">
									<xsl:for-each select="//gem:HealthOutcome">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Cost Analysis</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:CostAnalysis/node())">
									<xsl:for-each select="//gem:CostAnalysis">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Description of Harms and Benefits</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:SpecificationHarmBenefit/node())">
									<xsl:for-each select="//gem:SpecificationHarmBenefit">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Quantification of Harms and Benefits</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:QuantificationHarmBenefit/node())">
									<xsl:for-each select="//gem:QuantificationHarmBenefit">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Alternative Practices Risks</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:RoleValueJudgment/node())">
									<xsl:for-each select="//gem:RoleValueJudgment">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(16)</div>
							<div align="center">Patient preferences</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe the role of patient preferences when
							a recommendation involves a substantial element of personal choice
							or values.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Role of Patient Preferences</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:MethodOfDevelopment/gem:RolePatientPreference/node())">
									<xsl:for-each select="//gem:RolePatientPreference">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext"/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(17)</div>
							<div align="center">Algorithm</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Provide (when appropriate) a graphical
							description of the stages. and decisions in clinical care
							described by the guideline.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Algorithm</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:KnowledgeComponents/gem:Algorithm/node())">
									<xsl:for-each select="//gem:Algorithm">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Action Steps</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:KnowledgeComponents/gem:Algorithm/gem:ActionStep/node())">
									<xsl:for-each select="//gem:ActionStep">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Conditional Steps</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:KnowledgeComponents/gem:Algorithm/gem:ConditionalStep/node())">
									<xsl:for-each select="//gem:ConditionalStep">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Alternative Steps</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:KnowledgeComponents/gem:Algorithm/gem:BranchStep/node())">
									<xsl:for-each select="//gem:BranchStep">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Synchronization Step</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:KnowledgeComponents/gem:Algorithm/gem:SynchronizationStep/node())">
									<xsl:for-each select="//gem:SynchronizationStep">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td/>
					</tr>
					<tr>
						<td/>
						<td>
							<div align="center"/>
						</td>
						<td/>
						<td/>
					</tr>
					<tr>
						<td class="headerboldmain" valign="middle">
							<div class="headermain" align="left">(18)</div>
							<div align="center">Implementation considerations</div>
						</td>
						<td valign="middle">
							<div align="center">
								<i/>
							</div>
						</td>
						<td class="headertext">Describe anticipated barriers to application
							of the recommendations. Provide reference to any auxiliary
							documents for providers or patients that are intended to
							facilitate implementation. Suggest review criteria for measuring
							changes in care when the guideline is implemented.</td>
						<td/>
					</tr>
					
					<tr>
						<td class="rowheader">Implementation Plan</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:ImplementationPlan/node())">
									<xsl:for-each select="//gem:ImplementationPlan">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Implementation Strategy</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:ImplementationPlan/gem:ImplementationStrategy/node())">
									<xsl:for-each select="//gem:ImplementationStrategy">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Supporting Documents</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:CompanionDocument/node())">
									<xsl:for-each select="//gem:CompanionDocument">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Patient Resources</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:CompanionDocument/gem:PatientResource/node())">
									<xsl:for-each select="//gem:PatientResource">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Anticipated Enabler</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:ImplementationPlan/gem:AnticipatedEnabler/node())">
									<xsl:for-each select="//gem:AnticipatedEnabler">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Anticipated Barrier</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:ImplementationPlan/gem:AnticipatedBarrier/node())">
									<xsl:for-each select="//gem:AnticipatedBarrier">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Quick Reference Guide</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:CompanionDocument/gem:QuickReferenceGuide/node())">
									<xsl:for-each select="//gem:QuickReferenceGuide">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>
					<tr>
						<td class="rowheader">Technical Report</td>
						<td>
							<div align="center"/>
						</td>
						<td class="bodytext">
							<xsl:choose>
								<xsl:when
									test="normalize-space(/gem:GuidelineDocument/gem:Identity/gem:CompanionDocument/gem:TechnicalReport/node())">
									<xsl:for-each select="//gem:TechnicalReport">
										<xsl:value-of select="."/>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<B>
										<font color="red">Empty</font>
									</B>
								</xsl:otherwise>
							</xsl:choose>
							<div align="left"/>
						</td>
						<td/>
					</tr>

				</table>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
