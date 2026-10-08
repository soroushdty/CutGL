<xsl:stylesheet version="1.0" xmlns:gem="http://gem.yale.edu" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output media-type="html"/>

	<xsl:strip-space elements="gem:*"/>

	<xsl:template match="/">
		<html>
			<head>
				<style> </style>
			</head>
			<body>
				<table align="center">
					<tr>
						<td align="right"/>
					</tr>
					<tr>
						<td>
							<h2>
								<font color="navy">
									<xsl:value-of select="//gem:GuidelineTitle"/>
								</font>
							</h2>

							<table border="0" width="700" cellpadding="0" cellspacing="0" border-style="groove">
								<tr>
									<td valign="top" class="bord" width="548" colspan="2"/>
								</tr>
								<tr>
									<td valign="top" width="548">
										<b>IDENTITY</b>
									</td>
									<td valign="top" width="144">&#160;</td>
								</tr>
								<!--		<xsl:if
									test="//gem:Identity/text() !=''">
									<tr>
										<td valign="top">
											<xsl:value-of 	select="//gem:Identity/text()"/>
										</td>
										<td valign="top" align="center"/>
									</tr>
								</xsl:if> -->
								<xsl:for-each select="//gem:Identity/text()">

									<xsl:if test="normalize-space(.)">

										<tr>
											<td valign="top">&#183;&#160; <xsl:value-of select="."/>
												<td valign="top">&#160;</td>
											</td>
										</tr>

									</xsl:if>
								</xsl:for-each>

								<tr>

									<td valign="top">
										<b>Citation</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>
								<xsl:for-each select="//gem:Citation">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
								<tr>

									<td valign="top">
										<b>Date Released</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>
								<xsl:for-each select="//gem:ReleaseDate">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
								<tr>
									
									<td valign="top">
										<b>GEM Cut History</b>
									</td>
									<td valign="top">&#160;</td>
								</tr>
								<xsl:for-each select="//gem:GEMCutHistory">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<xsl:if test="normalize-space(text()) != ''">
											<tr>
												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>	
												</td>
											</tr>
											</xsl:if>
										</xsl:otherwise>
									</xsl:choose>
									<xsl:for-each select="./gem:GEMCutVersion">
										<xsl:if test="normalize-space(text()) != ''">
											<tr>
												<td valign="top">&#160;&#160;&#160;<b>GEM Cut Version: </b><xsl:value-of select="text()"/>
												</td>
											</tr>
										</xsl:if>
										<xsl:for-each select="./gem:GEMCutAuthor">
											<xsl:if test="normalize-space(text()) != ''">
												<tr>
													<td valign="top">&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;<b>GEM Cut Author: </b><xsl:value-of select="text()"/>  <td valign="top">&#160;</td>
													</td>
												</tr>
											</xsl:if>
										</xsl:for-each>
										<xsl:for-each select="./gem:GEMCutDate">
											<xsl:if test="normalize-space(text()) != ''">
												<tr>
													<td valign="top">&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;<b>GEM Cut Date </b><xsl:value-of select="text()"/> <td valign="top">&#160;</td>
													</td>
												</tr>
											</xsl:if>
										</xsl:for-each>
									</xsl:for-each>
								</xsl:for-each>
							</table>
							<hr/>
							<table border="0" width="700" cellpadding="0" cellspacing="0" border-style="groove">
								<tr>
									<td valign="top" class="bord" width="548" colspan="2"/>
								</tr>
								<tr>
									<td valign="top" width="548">
										<b>DEVELOPER</b>
									</td>
									<td valign="top" width="144">&#160;</td>
								</tr>
								<xsl:if test="//gem:Developer/text() !=''">
									<tr>
										<td valign="top">
											<xsl:value-of select="//gem:Developer/text()"/>
										</td>
										<td valign="top" align="center"/>
									</tr>
								</xsl:if>

								<tr>

									<td valign="top">
										<b>Developer Name</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>
								<xsl:for-each select="//gem:DeveloperName">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
								<tr>

									<td valign="top">
										<b>Conflict Of Interest Policy</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>
								<xsl:for-each select="//gem:COIPolicy">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
								<tr>

									<td valign="top">
										<b>Conflict Of Interest Disclosure</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>
								<xsl:for-each select="//gem:COIDisclosure">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
							</table>
							<hr/>
							<table border="0" width="700" cellpadding="0" cellspacing="0" border-style="groove">
								<tr>
									<td valign="top" class="bord" width="548" colspan="2"/>
								</tr>
								<tr>
									<td valign="top" width="548">
										<b>PURPOSE</b>
									</td>
									<td valign="top" width="144">&#160;</td>
								</tr>
								<xsl:if test="//gem:Purpose/text() !=''">
									<tr>
										<td valign="top">
											<xsl:value-of select="//gem:Purpose/text()"/>
										</td>
										<td valign="top" align="center"/>
									</tr>
								</xsl:if>

								<tr>

									<td valign="top">
										<b>Objective</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>
								<xsl:for-each select="//gem:Objective">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
							</table>
							<hr/>
							<table border="0" width="700" cellpadding="0" cellspacing="0" border-style="groove">
								<tr>
									<td valign="top" class="bord" width="548" colspan="2"/>
								</tr>
								<tr>
									<td valign="top" width="548">
										<b>INTENDED AUDIENCE</b>
									</td>
									<td valign="top" width="144">&#160;</td>
								</tr>
								<xsl:if test="//gem:IntendedAudience/text() !=''">
									<tr>
										<td valign="top">
											<xsl:value-of select="//gem:IntendedAudience/text()"/>
										</td>
										<td valign="top" align="center"/>
									</tr>
								</xsl:if>

								<tr>

									<td valign="top">
										<b>Intended Users</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>
								<xsl:for-each select="//gem:Users">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
								<tr>

									<td valign="top">
										<b>Care Setting</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>
								<xsl:for-each select="//gem:CareSetting">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
							</table>
							<hr/>

							<table border="0" width="700" cellpadding="0" cellspacing="0" border-style="groove">
								<tr>
									<td valign="top" class="bord" width="548" colspan="2"/>
								</tr>
								<tr>
									<td valign="top" width="548">
										<b>METHOD OF DEVELOPMENT</b>
									</td>
									<td valign="top" width="144">&#160;</td>
								</tr>
								<xsl:if test="//gem:MethodOfDevelopment/text() !=''">
									<tr>
										<td valign="top">
											<xsl:value-of select="//gem:MethodOfDevelopment/text()"/>
										</td>
										<td valign="top" align="center"/>
									</tr>
								</xsl:if>

								<tr>

									<td valign="top">
										<b>Rating Scheme</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>


								<xsl:for-each select="//gem:RatingScheme/text()">

									<xsl:if test="normalize-space(.)">

										<tr>
											<td valign="top">&#183;&#160; <xsl:value-of select="."/>
												<td valign="top">&#160;</td>
											</td>
										</tr>

									</xsl:if>
								</xsl:for-each>

								<!--					<xsl:for-each select="//gem:RatingScheme">
										<xsl:if test="//gem:RatingScheme/text() !=''">
											<tr>
												<td valign="top"
													>&#183;&#160;
													<xsl:value-of
														select="./text()"/>
													<td valign="top"
														>&#160;</td>
												</td>
											</tr>
										</xsl:if>
						</xsl:for-each>
-->
								<tr>

									<td valign="top">
										<b>Evidence Quality Rating Scheme</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>

								<xsl:for-each select="//gem:EvidenceQualityRatingScheme">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
								<tr>
									<td valign="top">
										<b>Recommendation Strength Rating Scheme</b>
									</td>
									<td valign="top">&#160;</td>
								</tr>
								<xsl:for-each select="//gem:RecommendationStrengthRatingScheme">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>
												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
								<tr>
									<td valign="top">
										<b>Qualifying Statement</b>
									</td>
									<td valign="top">&#160;</td>
								</tr>
								<xsl:for-each select="//gem:QualifyingStatement">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
								<tr>
									<td valign="top">
										<b>Patient And Public Involvement</b>
									</td>
									<td valign="top">&#160;</td>
								</tr>
								<xsl:for-each select="//gem:PatientAndPublicInvolvement">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>
												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
							</table>
							<hr/>
							<table border="0" width="700" cellpadding="0" cellspacing="0" border-style="groove">
								<tr>
									<td valign="top" class="bord" width="548" colspan="2"/>
								</tr>
								<tr>
									<td valign="top" width="548">
										<b>TARGET POPULATION</b>
									</td>
									<td valign="top" width="144">&#160;</td>
								</tr>
								<xsl:if test="//gem:TargetPopulation/text() !=''">
									<tr>
										<td valign="top">
											<xsl:value-of select="//gem:TargetPopulation/text()"/>
										</td>
										<td valign="top" align="center"/>
									</tr>
								</xsl:if>

								<xsl:if test="//gem:Eligibility/text() !=''">
									<tr>

										<td valign="top">
											<b>Eligibility</b>
										</td>
										<td valign="top">&#160;</td>
									</tr>
									<tr>

										<td valign="top">
											<xsl:value-of select="//gem:Eligibility/text()"/>
										</td>
										<td valign="top" align="center"/>

									</tr>
								</xsl:if>

								<tr>

									<td valign="top">
										<b>Inclusion Criterion</b>
									</td>
									<td valign="top">&#160;</td>

								</tr>
								<xsl:for-each select="//gem:InclusionCriterion">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
									<xsl:for-each select="./gem:InclusionCriterionCode">
										<xsl:if test="normalize-space(text()) != ''">
											<tr>
												<td valign="top">&#160;&#160;<b>Code Set: </b><xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} <td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:if>
									</xsl:for-each>
								</xsl:for-each>
								<tr>

									<td valign="top">
										<b>Exclusion Criterion</b>
									</td>
									<td valign="top">&#160;</td>
								</tr>
								<xsl:for-each select="//gem:ExclusionCriterion">
									<xsl:choose>
										<xsl:when test=" .='' "/>
										<xsl:otherwise>
											<tr>

												<td valign="top">&#183;&#160;<xsl:value-of select="text()"/>
													<td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:otherwise>
									</xsl:choose>
									<xsl:for-each select="./gem:ExclusionCriterionCode">
										<xsl:if test="normalize-space(text()) != ''">
											<tr>
												<td valign="top">&#160;&#160;<b>Code Set: </b><xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} <td valign="top">&#160;</td>
												</td>
											</tr>
										</xsl:if>
									</xsl:for-each>
								</xsl:for-each>
							</table>
							<hr/>
							<table border="0" width="700" cellpadding="0" cellspacing="0">
								<tr>
									<td valign="top">&#160;</td>
									<td valign="top">&#160;</td>
									<td valign="top">&#160;</td>
									<td valign="top">&#160;</td>
								</tr>
								<tr>
									<td colspan="4" valign="top">
										<b>KNOWLEDGE COMPONENTS</b>
									</td>


								</tr>
								<tr>
									<td valign="top">&#160;</td>
									<td valign="top">&#160;</td>
									<td valign="top">&#160;</td>
									<td valign="top">&#160;</td>
								</tr>

								<tr>
									<td colspan="4" valign="top">
										<b>DEFINITIONS</b>
									</td>

								</tr>
								<tr>
									<td valign="top" colspan="4">

										<table border="0" cellpadding="0" cellspacing="0">
											<xsl:for-each select="//gem:Term">
												<xsl:if test="normalize-space(text()) !=''">
													<tr>
														<td valign="top" width="50"/>
														<td valign="top" width="100">
															<b>Term:</b>
														</td>
														<td width="400" valign="top">
															<xsl:value-of select="text()"/>
														</td>
														<td width="150"/>
													</tr>
													<xsl:for-each select="./gem:TermMeaning">
														<xsl:if test="normalize-space(text()) !=''">
															<tr>
																<td valign="top" width="50"/>
																<td valign="top" width="120">
																	<b>Term Meaning:</b>
																</td>
																<td width="400" valign="top">
																	<xsl:value-of select="text()"/>
																</td>
																<td width="150"/>
															</tr>
														</xsl:if>
													</xsl:for-each>
												</xsl:if>
											</xsl:for-each>

										</table>
									</td>
								</tr>

								<xsl:for-each select="//gem:Recommendation">
									<tr>
										<td valign="top">&#160;</td>
										<td valign="top">&#160;</td>
										<td valign="top">&#160;</td>
										<td valign="top">&#160;</td>
									</tr>

									<tr>
										<td valign="top" colspan="4">
											<b>RECOMMENDATION: </b>
											<xsl:value-of select="text()"/>
										</td>
									</tr>
									<xsl:for-each select=".//.">

										<xsl:if test="name(.) = 'RecommendationNotes'">
											<xsl:if test="normalize-space(text()) !=''">
												<tr>
													<td valign="top" colspan="4">
														<table border="0" cellpadding="0" cellspacing="0">
															<tr>
																<td valign="top" width="15" bgcolor="#E0DFE3"/>
																<td valign="top" width="100" bgcolor="#E0DFE3">
																	<b>Notes:&#160;&#160;&#160;&#160;</b>
																</td>
																<td width="430" valign="top" bgcolor="#E0DFE3">
																	<xsl:value-of select="text()"/>
																</td>
																<td width="150" bgcolor="#E0DFE3"/>
															</tr>
														</table>
													</td>
												</tr>
											</xsl:if>
										</xsl:if>

										<xsl:if test="name(.) = 'StatementOfFact'">
											<xsl:if test="normalize-space(text()) !=''">
												<tr>
													<td valign="top" colspan="4">
														<table border="0" cellpadding="0" cellspacing="0">
															<tr>
																<td valign="top" width="15" bgcolor="#E0DFE3"/>
																<td valign="top" width="100" bgcolor="#E0DFE3">
																	<b>StatementOfFact:&#160;&#160;&#160;&#160;</b>
																</td>
																<td width="430" valign="top" bgcolor="#E0DFE3">
																	<xsl:value-of select="text()"/> {Rec_<xsl:value-of select="../@id"/>:SoF_ <xsl:value-of select="@id"/> } </td>
																<td width="150" bgcolor="#E0DFE3"/>
															</tr>
														</table>
													</td>
												</tr>
											</xsl:if>
										</xsl:if>
										<xsl:if test="name(.) = 'Conditional'">
											<xsl:if test="normalize-space(text()) !=''">
												<tr>
													<td valign="top" colspan="4">
														<table border="0" cellpadding="0" cellspacing="0">
															<tr>
																<td valign="top" width="50" bgcolor="#E0DFE3"/>
																<td valign="top" width="100" bgcolor="#E0DFE3">
																	<b>Conditional:</b>
																</td>
																<td width="400" valign="top" bgcolor="#E0DFE3">
																	<xsl:value-of select="text()"/> {Rec_<xsl:value-of select="../@id"/>:Cond_ <xsl:value-of select="@id"/> } </td>
																<td width="150" bgcolor="#E0DFE3"/>
															</tr>

															<xsl:for-each select="./gem:BenefitHarmAssessment">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Benefit Harm Assessment: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>

																	</tr>
																</xsl:if>
															</xsl:for-each>



															<xsl:for-each select="./gem:DecisionVariable">
																<xsl:if test="normalize-space(text()) !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">
																			<b>Decision Variable: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" align="right" valign="top" bgcolor="#FFFFCC"> </td>
																	</tr>
																	<xsl:for-each select="./gem:Value">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Value: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DecisionVariableDescription">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Description: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DecisionVariableCost">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Cost: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>

																	<xsl:for-each select="./gem:TestParameter">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>TestParameter: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																			<xsl:for-each select="./gem:Sensitivity">
																				<xsl:if test="normalize-space(text()) != ''">
																					<tr>
																						<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																						<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																						<td valign="top" colspan="2" bgcolor="#FFFFCC">
																							<table border="0" cellpadding="0" cellspacing="0">
																								<tr>
																									<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																									<td valign="top" bgcolor="#FFFFCC" width="20">&#160;</td>
																									<td valign="top" width="390">
																										<b>Sensitivity: </b>
																										<xsl:value-of select="text()"/>
																									</td>
																								</tr>
																							</table>
																						</td>
																					</tr>

																				</xsl:if>
																			</xsl:for-each>
																			<xsl:for-each select="./gem:Specificity">
																				<xsl:if test="normalize-space(text()) != ''">
																					<tr>
																						<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																						<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																						<td valign="top" colspan="2" bgcolor="#FFFFCC">
																							<table border="0" cellpadding="0" cellspacing="0">
																								<tr>
																									<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																									<td valign="top" bgcolor="#FFFFCC" width="20">&#160;</td>
																									<td valign="top" width="390">
																										<b>Specificity: </b>
																										<xsl:value-of select="text()"/>
																									</td>
																								</tr>
																							</table>
																						</td>
																					</tr>

																				</xsl:if>
																			</xsl:for-each>
																			<xsl:for-each select="./gem:PredictiveValue">
																				<xsl:if test="normalize-space(text()) != ''">
																					<tr>
																						<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																						<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																						<td valign="top" colspan="2" bgcolor="#FFFFCC">
																							<table border="0" cellpadding="0" cellspacing="0">
																								<tr>
																									<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																									<td valign="top" bgcolor="#FFFFCC" width="20">&#160;</td>
																									<td valign="top" width="390">
																										<b>Predictive Value: </b>
																										<xsl:value-of select="text()"/>
																									</td>
																								</tr>
																							</table>
																						</td>
																					</tr>

																				</xsl:if>
																			</xsl:for-each>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DecisionVariableCode">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Code Set: </b><xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Action">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Action: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>

																	</tr>
																	<xsl:for-each select="./gem:ActionValue">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Value: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:ActionType">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Type: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:ActionBenefit">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Benefit: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:ActionCost">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Cost: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:ActionActor">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Actor: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:ActionVerb">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Verb: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:ActionVerbComplement">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Complement: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:ActionDeonticTerm">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Deontic: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:ActionRiskHarm">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Risk/Harm: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:ActionDescription">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Description: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																			<xsl:for-each select="./gem:IntentionalVagueness">
																				<xsl:if test="normalize-space(text()) != ''">
																					<tr>
																						<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																						<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																						<td valign="top" colspan="2" bgcolor="#FFFFCC">
																							<table border="0" cellpadding="0" cellspacing="0">
																								<tr>
																									<td valign="top" bgcolor="#FFFFCC" width="70">&#160;</td>
																									<td valign="top" bgcolor="#FFFFCC" width="360">
																										<b>Intentional Vagueness: </b>
																										<xsl:value-of select="text()"/>
																									</td>
																									<td valign="top" width="150">&#160;</td>
																								</tr>
																							</table>
																						</td>
																					</tr>
																				</xsl:if>
																			</xsl:for-each>
																		</xsl:if>
																	</xsl:for-each>

																	<xsl:for-each select="./gem:ActionCode">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Code Set: </b><xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>






																</xsl:if>
															</xsl:for-each>

															<xsl:for-each select="./gem:Reason">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Reason: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>

																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:EvidenceQuality">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Evidence Quality: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>

																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:RecommendationStrength">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Recommendation Strength: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																	<xsl:for-each select="./gem:RecommendationStrengthCode">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Code Set: </b><xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>

																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Flexibility">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Flexibility: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Logic">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Logic: </b>
																			<br/>
																			<p style="margin-left:40px">
																				<xsl:call-template name="break">
																					<xsl:with-param name="text">
																						<xsl:value-of select="text()"/>
																					</xsl:with-param>
																				</xsl:call-template>
																			</p>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Cost">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Cost: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Linkage">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Linkage: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Reference">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Reference: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Certainty">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Certainty: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Goal">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Goal: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
														</table>
													</td>
												</tr>

											</xsl:if>
										</xsl:if>

										<xsl:if test="name(.) = 'Imperative'">

											<xsl:if test="normalize-space(text()) !=''">
												<tr>
													<td valign="top" colspan="4">
														<table border="0" cellpadding="0" cellspacing="0">
															<tr>
																<td valign="top" width="50" bgcolor="#E0DFE3"/>
																<td valign="top" width="100" bgcolor="#E0DFE3">
																	<b>Imperative:</b>
																</td>

																<td width="400" valign="top" bgcolor="#E0DFE3">
																	<xsl:value-of select="text()"/> {Rec_<xsl:value-of select="../@id"/>:Imp_ <xsl:value-of select="@id"/> } </td>
																<td width="150" bgcolor="#E0DFE3"/>
															</tr>

															<xsl:for-each select="./gem:BenefitHarmAssessment">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Benefit Harm Assessment: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>

																	</tr>
																</xsl:if>
															</xsl:for-each>

															<xsl:for-each select="./gem:Scope">
																<xsl:if test="normalize-space(text()) !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#ffffcc">&#160;</td>
																		<td valign="top" width="100" bgcolor="#ffffcc">&#160;</td>
																		<td valign="top" width="400" bgcolor="#ffffcc">
																			<b>Scope: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> &#160; </td>
																	</tr>
																	<xsl:for-each select="./gem:ScopeCode">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Code Set: </b><xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																</xsl:if>
															</xsl:for-each>

															<xsl:for-each select="./gem:Directive">
																<xsl:if test="normalize-space(text()) !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#ffffcc">&#160;</td>
																		<td valign="top" width="100" bgcolor="#ffffcc">&#160;</td>
																		<td valign="top" width="400" bgcolor="#ffffcc">
																			<b>Directive: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> &#160; </td>
																	</tr>
																	<xsl:for-each select="./gem:DirectiveValue">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Value: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DirectiveType">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Type: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DirectiveDescription">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Description: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																			<xsl:for-each select="./gem:IntentionalVagueness">
																				<xsl:if test="normalize-space(text()) != ''">
																					<tr>
																						<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																						<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																						<td valign="top" colspan="2" bgcolor="#FFFFCC">
																							<table border="0" cellpadding="0" cellspacing="0">
																								<tr>
																									<td valign="top" bgcolor="#FFFFCC" width="70">&#160;</td>
																									<td valign="top" bgcolor="#FFFFCC" width="360">
																										<b>Intentional Vagueness: </b>
																										<xsl:value-of select="text()"/>
																									</td>
																									<td valign="top" width="150">&#160;</td>
																								</tr>
																							</table>
																						</td>
																					</tr>
																				</xsl:if>
																			</xsl:for-each>
																		</xsl:if>
																	</xsl:for-each>




																	<xsl:for-each select="./gem:DirectiveBenefit">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Benefit: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DirectiveRiskHarm">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Risk/Harm: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DirectiveCost">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Cost: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DirectiveActor">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Actor: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DirectiveVerb">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Verb: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DirectiveVerbComplement">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Complement: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:DirectiveDeonticTerm">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Deontic: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>

																	<xsl:for-each select="./gem:DirectiveCode">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Code Set: </b><xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>

																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Reason">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Reason: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>

																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:EvidenceQuality">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Evidence Quality: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>

																	</tr>
																	<xsl:for-each select="./gem:EvidenceQualityDescription">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Evidence Quality Description: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>
																	<xsl:for-each select="./gem:Disagreement">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Disagreement: </b>
																								<xsl:value-of select="text()"/>
																							</td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>





																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:RecommendationStrength">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Recommendation Strength: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>

																	<xsl:for-each select="./gem:RecommendationStrengthCode">
																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																				<td valign="top" colspan="2" bgcolor="#FFFFCC">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" bgcolor="#FFFFCC" width="40">&#160;</td>
																							<td valign="top" bgcolor="#FFFFCC" width="360">
																								<b>Code Set: </b><xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </td>
																							<td valign="top" width="150">&#160;</td>
																						</tr>
																					</table>
																				</td>
																			</tr>
																		</xsl:if>
																	</xsl:for-each>

																</xsl:if>

															</xsl:for-each>
															<xsl:for-each select="./gem:Flexibility">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Flexibility: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Logic">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Logic: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Cost">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Cost: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Linkage">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Linkage: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Reference">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Reference: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Certainty">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Certainty: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
															<xsl:for-each select="./gem:Goal">
																<xsl:if test=". !=''">
																	<tr>
																		<td valign="top" width="50" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="100" bgcolor="#FFFFCC">&#160;</td>
																		<td valign="top" width="400" bgcolor="#FFFFCC">

																			<b>Goal: </b>
																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150" valign="top" align="right" bgcolor="#FFFFCC"> </td>
																	</tr>
																</xsl:if>
															</xsl:for-each>
														</table>
													</td>
												</tr>

											</xsl:if>
										</xsl:if>
									</xsl:for-each>
								</xsl:for-each>

								<xsl:for-each select="//gem:Algorithm">
									<tr>
										<td valign="top">&#160;</td>
										<td valign="top">&#160;</td>
										<td valign="top">&#160;</td>
										<td valign="top">&#160;</td>
									</tr>

									<tr>
										<td valign="top" colspan="4">
											<b>ALGORITHM: </b>
											<xsl:value-of select="text()"/>
										</td>
									</tr>
									<xsl:for-each select="./gem:ActionStep">
										<xsl:if test="normalize-space(text()) !=''">
											<tr>
												<td valign="top" colspan="4">

													<table border="0" cellpadding="0" cellspacing="0">
														<tr>
															<td valign="top" width="50"/>
															<td valign="top" width="150">
																<b>Action Step:</b>
															</td>
															<td valign="top">
																<xsl:value-of select="text()"/>
															</td>
															<td valign="top">&#160;</td>
														</tr>
													</table>
												</td>
											</tr>
										</xsl:if>
									</xsl:for-each>
									<xsl:for-each select="./gem:ConditionalStep">
										<xsl:if test="normalize-space(text()) !=''">
											<tr>
												<td valign="top" colspan="4">

													<table border="0" cellpadding="0" cellspacing="0">
														<tr>
															<td valign="top" width="50"/>
															<td valign="top" width="150">
																<b>Conditional Step:</b>
															</td>
															<td valign="top">
																<xsl:value-of select="text()"/>
															</td>
															<td valign="top">&#160;</td>
														</tr>
													</table>
												</td>
											</tr>
										</xsl:if>
									</xsl:for-each>
									<xsl:for-each select="./gem:BranchStep">
										<xsl:if test="normalize-space(text()) !=''">
											<tr>
												<td valign="top" colspan="4">

													<table border="0" cellpadding="0" cellspacing="0">
														<tr>
															<td valign="top" width="50"/>
															<td valign="top" width="150">
																<b>Branch Step:</b>
															</td>
															<td valign="top">
																<xsl:value-of select="text()"/>
															</td>
															<td valign="top">&#160;</td>
														</tr>
													</table>
												</td>
											</tr>
										</xsl:if>
									</xsl:for-each>
									<xsl:for-each select="./gem:SynchronizationStep">
										<xsl:if test="normalize-space(text()) !=''">
											<tr>
												<td valign="top" colspan="4">

													<table border="0" cellpadding="0" cellspacing="0">
														<tr>
															<td valign="top" width="50"/>
															<td valign="top" width="150">
																<b>Synchronization Step:</b>
															</td>
															<td valign="top">
																<xsl:value-of select="text()"/>
															</td>
															<td valign="top">&#160;</td>
														</tr>
													</table>
												</td>
											</tr>
										</xsl:if>
									</xsl:for-each>
								</xsl:for-each>














								<xsl:for-each select="//gem:ResearchAgenda">
									<xsl:if test="normalize-space(text()) !=''">
										<tr>
											<td valign="top">&#160;</td>
											<td valign="top">&#160;</td>
											<td valign="top">&#160;</td>
											<td valign="top">&#160;</td>
										</tr>

										<tr>
											<td valign="top" colspan="4">
												<b>RESEARCH AGENDA: </b>
												<xsl:value-of select="text()"/>
											</td>
										</tr>
									</xsl:if>
								</xsl:for-each>

								<xsl:for-each select="//gem:BackgroundInformation">
									<xsl:if test="normalize-space(text()) !=''">
										<tr>
											<td valign="top">&#160;</td>
											<td valign="top">&#160;</td>
											<td valign="top">&#160;</td>
											<td valign="top">&#160;</td>
										</tr>

										<tr>
											<td valign="top" colspan="4">
												<b>BACKGROUND INFORMATION: </b>
												<xsl:value-of select="text()"/>
											</td>
										</tr>
									</xsl:if>
								</xsl:for-each>
							</table>
							<tr>
								<td align="right"/>
							</tr>
						</td>
					</tr>
				</table>
				<center>
					<h5>
						<i>Produced by Extractor - Copyright 2006 Yale Center for Medical Informatics <xsl:variable name="date" select="document('http://gem.med.yale.edu/date.php')/timestamp"/>
							<xsl:value-of select="$date"/>
						</i>
					</h5>
				</center>
			</body>
		</html>
	</xsl:template>
	<xsl:template name="break">
		<xsl:param name="text" select="."/>
		<xsl:choose>
			<xsl:when test="contains($text,'&#xa;')">
				<xsl:value-of select="substring-before($text,'&#xa;')"/>
				<br/>
				<xsl:call-template name="break">
					<xsl:with-param name="text" select="substring-after($text,'&#xa;')"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$text"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
