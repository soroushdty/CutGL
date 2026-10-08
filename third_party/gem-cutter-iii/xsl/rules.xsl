<xsl:stylesheet version="1.0" xmlns:gem="http://gem.yale.edu" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output media-type="html"/>

	<xsl:strip-space elements="gem:*"/>
	<xsl:template match="/">
		<html>
			<head>
				<style> td.bord { border-bottom: solid #000000; } </style>
			</head>
			<body>
				<table align="center" width="700">
					<tr>
						<td>
							<h2>
								<font color="navy">
									<xsl:value-of select="//gem:GuidelineTitle"/>
								</font>
							</h2>
						</td>
					</tr>

					<tr>
						<td valign="top" width="548"> </td>
						<td valign="top" bgcolor="#ffffff" width="144" align="right"/>
					</tr>
					<tr>
						<td>
							<table style="width:700;border-style:solid;border-width:thin;border-color:#000000">

								<tr>
									<td valign="top" class="bord" width="548" colspan="2"/>

								</tr>
								<tr>
									<td valign="top" width="548">
										<b>TARGET POPULATION</b>
									</td>
									<td valign="top" width="104" align="center">
										<b>Decidable</b>
									</td>
								</tr>
								<tr>
									<td valign="top" width="548"> &#160; </td>
									<td valign="top" width="104" align="center">
										<b>(Y or N)</b>
									</td>
								</tr>


								<xsl:choose>
									<xsl:when test="//gem:Eligibility/text() !=''">
										<tr>

											<td valign="top">
												<b>Eligibility</b>
											</td>
											<td valign="top" align="center"/>
										</tr>
										<tr>

											<td valign="top">
												<xsl:value-of select="//gem:Eligibility/text()"/>
											</td>

											<td align="right">
												<table width="60px">
													<tr>
														<td valign="top" style=" height:15px; empty-cells: show ;border-width: 1px;border-style: solid;border-color: #000000;">&#160;</td>
													</tr>
												</table>
											</td>
										</tr>

									</xsl:when>
									<xsl:otherwise>
										<tr>

											<td valign="top">
												<b>Eligibility</b>
											</td>
											<td align="right">
												<table width="60px">
													<tr>
														<td valign="top" style=" height:15px; empty-cells: show ;border-width: 1px;border-style: solid;border-color: #000000;">&#160;</td>
													</tr>
												</table>
											</td>

										</tr>
									</xsl:otherwise>
								</xsl:choose>

								<tr>

									<td valign="top">
										<b>Inclusion Criterion</b>
									</td>
									<xsl:choose>
										<xsl:when test="//gem:InclusionCriterion/text() != ''">

											<td valign="top">&#160;</td>
											<xsl:for-each select="//gem:InclusionCriterion">
												<xsl:choose>
													<xsl:when test=" .='' "/>

													<xsl:otherwise>
														<tr>
															<td valign="top">&#183;&#160;<xsl:value-of select="text()"/></td>
															<td align="right">
																<table width="60px">
																	<tr>
																		<td valign="top" style="height:15px; empty-cells: show ;border-width: 1px;border-style: solid;border-color: #000000;">&#160; </td>
																	</tr>
																</table>
															</td>
														</tr>
													</xsl:otherwise>
												</xsl:choose>
											</xsl:for-each>
										</xsl:when>
										<xsl:otherwise>
											<td align="right">
												<table width="60px">
													<tr>
														<td valign="top" style="height:15px; empty-cells: show ;border-width: 1px;border-style: solid;border-color: #000000;">&#160; </td>
													</tr>
												</table>
											</td>

										</xsl:otherwise>

									</xsl:choose>


								</tr>

								<tr>

									<td valign="top">
										<b> Exclusion Criterion</b>
									</td>
									<xsl:choose>
										<xsl:when test="//gem:ExclusionCriterion/text() != ''">

											<td valign="top">&#160;</td>
											<xsl:for-each select="//gem:ExclusionCriterion">
												<xsl:choose>
													<xsl:when test=" .='' "/>
													<xsl:otherwise>
														<tr>
															<td valign="top">&#183;&#160;<xsl:value-of select="text()"/></td>
															<td align="right">
																<table width="60px">
																	<tr>
																		<td valign="top" style="height:15px; empty-cells: show ;border-width: 1px;border-style: solid;border-color: #000000;">&#160;</td>
																	</tr>
																</table>
															</td>
														</tr>
													</xsl:otherwise>
												</xsl:choose>
											</xsl:for-each>
										</xsl:when>
										<xsl:otherwise>
											<td align="right">
												<table width="60px">
													<tr>
														<td valign="top" style="height:15px; empty-cells: show ;border-width: 1px;border-style: solid;border-color: #000000;">&#160; </td>
													</tr>
												</table>
											</td>

										</xsl:otherwise>

									</xsl:choose>


								</tr>
								<tr>

									<td valign="top" class="bord" width="548" colspan="2"/>

								</tr>

								<tr>

									<td valign="top" class="bord" width="548" colspan="2"/>

								</tr>
							</table>

							<table style="width:700;border-style:solid;border-width:thin;border-color:#000000">
								<tr>
									<td valign="top">&#160;</td>
									<td valign="top">&#160;</td>
									<td valign="top">&#160;</td>
									<td valign="top">&#160;</td>
								</tr>
								<tr>
									<td colspan="2" valign="top">
										<b>RECOMMENDATIONS</b>
									</td>
									<td valign="top">&#160;</td>
									<td valign="top">&#160;</td>
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
											<b>Recommendation</b>
											<br/>
											<xsl:value-of select="text()"/>
										</td>
									</tr>
									<xsl:for-each select=".//.">
										<xsl:if test="name(.) = 'Conditional'">
											<xsl:if test="normalize-space(text()) !=''">
												<tr>
													<td valign="top" colspan="4">

														<table border="0" cellpadding="0" cellspacing="0">
															<tr>
																<td valign="top" width="50"/>
																<td valign="top" width="100">
																	<b>Conditional:</b>
																</td>
																<td width="400" valign="top">
																	<xsl:value-of select="text()"/>
																</td>
																<td width="150"/>
															</tr>
															<tr>
																<td valign="top" colspan="4">
																	<b/> &#160; </td>
															</tr>
															<tr>
																<td valign="top" colspan="4"> </td>
															</tr>
															<tr>
																<td valign="top" colspan="4">
																	<b/> &#160; </td>
															</tr>
															<tr>
																<td valign="top" width="50"/>
																<td valign="top" width="100">
																	<b/>
																</td>
																<td width="400" valign="top">
																	<strong>IF</strong>
																</td>
																<td width="150">
																	<table cellpadding="0" cellspacing="0">
																		<td align="center" style="border-width: 1px;border-style: solid;border-color: #000000;" width="75">
																			<strong>Decidable</strong>
																		</td>
																		<td style="border-width: 1px;border-style: solid;	border-color: #000000;" width="75" align="center">
																			<strong>Vocab</strong>
																		</td>
																	</table>
																</td>

															</tr>
															<xsl:for-each select="./gem:DecisionVariable">
																<xsl:if test="normalize-space(text()) !=''">
																	<tr>
																		<td valign="top" width="50">&#160;</td>
																		<td valign="top" width="100">&#160;</td>
																		<td valign="top" width="400">

																			<xsl:value-of select="text()"/>
																		</td>
																		<td width="150">
																			<table cellpadding="0" cellspacing="0">
																				<td align="center" style="height:25px; empty-cells: show ;border-width: 1px;border-style: solid;border-color: #000000;" width="75"/>
																				<td style="empty-cells: show;border-width: 1px;border-style: solid;	border-color: #000000;" width="75" align="center"/>
																			</table>
																		</td>

																	</tr>
																	<xsl:for-each select="./gem:Value">

																		<xsl:if test="normalize-space(text()) != ''">
																			<tr>
																				<td valign="top" width="50">&#160;</td>
																				<td valign="top" width="100">&#160;</td>
																				<td valign="top" colspan="2">
																					<table border="0" cellpadding="0" cellspacing="0">
																						<tr>
																							<td valign="top" width="40">&#160;</td>
																							<td valign="top" width="360">
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
																</xsl:if>
															</xsl:for-each>
															<tr>
																<td valign="top" width="50"/>
																<td valign="top" width="100">
																	<b/>
																</td>
																<td width="400" valign="top">
																	<strong>THEN</strong>
																</td>
																<td width="150">
																	<table cellpadding="0" cellspacing="0">
																		<td align="center" style="border-width: 1px;border-style: solid;border-color: #000000;" width="75">
																			<strong>Executable</strong>
																		</td>
																		<td style="border-width: 1px;border-style: solid;	border-color: #000000;" width="75" align="center">
																			<strong>Vocab</strong>
																		</td>
																	</table>
																</td>
															</tr>
															<xsl:for-each select="./gem:Action">
																<xsl:choose>
																	<xsl:when test="normalize-space(text()) !=''">

																		<tr>
																			<td valign="top" width="50">&#160;</td>
																			<td valign="top" width="100">&#160;</td>
																			<td valign="top" width="400">


																				<xsl:value-of select="text()"/>
																			</td>
																			<td width="150">
																				<table cellpadding="0" cellspacing="0">
																					<td align="center" style="height:25px; empty-cells: show ;border-width: 1px;border-style: solid;border-color: #000000;" width="75"/>
																					<td style="empty-cells: show;border-width: 1px;border-style: solid;	border-color: #000000;" width="75" align="center"/>
																				</table>
																			</td>

																		</tr>
																	</xsl:when>
																	<xsl:otherwise>
																		<xsl:if test="position()=1">
																			<tr>
																				<td valign="top" width="50">&#160;</td>
																				<td valign="top" width="100">&#160;</td>
																				<td valign="top" width="400">


																					<xsl:value-of select="text()"/>
																				</td>
																				<td width="150">
																					<table cellpadding="0" cellspacing="0">
																						<td align="center" style="height:25px; empty-cells: show ;border-width: 1px;border-style: solid;border-color: #000000;" width="75"/>
																						<td style="empty-cells: show;border-width: 1px;border-style: solid;	border-color: #000000;" width="75" align="center"/>
																					</table>
																				</td>

																			</tr>
																		</xsl:if>
																	</xsl:otherwise>
																</xsl:choose>



															</xsl:for-each>

														</table>
													</td>
												</tr>
												<tr>
													<td>
														<table border="0" cellpadding="4" cellspacing="4">
															<tr>

																<td valign="top" width="300">
																	<strong>Evidence Quality:</strong>
																</td>
																<td valign="top" width="100%">
																	<xsl:value-of select="./gem:EvidenceQuality"/>
																</td>
															</tr>
															<tr>

																<td valign="top" width="300">
																	<strong>Strength of Recommendation:</strong>
																</td>
																<td valign="top" width="100%">
																	<xsl:value-of select="./gem:RecommendationStrength/text()"/>
																</td>
															</tr>
															<tr>

																<td valign="top" width="300">
																	<strong>Reason:</strong>
																</td>
																<td valign="top" width="100%">
																	<xsl:value-of select="./gem:Reason"/>
																</td>
															</tr>
															<tr>

																<td valign="top" width="300">
																	<strong>Logic:</strong>
																</td>
																<td valign="top" width="100%">
																	<xsl:call-template name="break">
																		<xsl:with-param name="text">
																			<xsl:value-of select="./gem:Logic"/>
																		</xsl:with-param>
																	</xsl:call-template>

																</td>
															</tr>

															<tr>

																<td valign="top" width="300">&#160;</td>
																<td valign="top" width="100%">&#160;</td>
															</tr>
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
																<td valign="top" width="50"/>
																<td valign="top" width="100">
																	<b>Imperative:</b>
																</td>

																<td width="400" valign="top">
																	<xsl:value-of select="text()"/>
																</td>
																<td width="150"/>
															</tr>
															<tr>
																<td valign="top" colspan="4">
																	<b/> &#160; </td>
															</tr>

															<tr>
																<td valign="top" colspan="4">
																	<b/> &#160; </td>
															</tr>
															<tr>
																<td valign="top" width="50"/>
																<td valign="top" width="100">
																	<b>IF</b>
																</td>
																<td width="400" valign="top"> </td>
																<td width="150"/>
															</tr>
															<tr>
																<td valign="top" width="50"/>
																<td valign="top" width="100"> </td>
																<td width="400" valign="top">
																	<strong>Inclusion Criterion:</strong>
																	<xsl:for-each select="//gem:InclusionCriterion">
																		<xsl:choose>
																			<xsl:when test=" .='' "/>
																			<xsl:otherwise>
																				<table>
																					<tr>

																						<td valign="top">&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#183;&#160;<xsl:value-of select="text()"/>
																							<td valign="top">&#160;</td>
																						</td>
																					</tr>
																				</table>

																			</xsl:otherwise>
																		</xsl:choose>
																	</xsl:for-each>

																</td>
																<td width="150"/>
															</tr>
															<tr>
																<td valign="top" width="50"/>
																<td valign="top" width="100"> </td>
																<td width="400" valign="top">
																	<strong>Exclusion Criterion:</strong>
																	<xsl:for-each select="//gem:ExclusionCriterion">
																		<xsl:choose>
																			<xsl:when test=" .='' "/>
																			<xsl:otherwise>

																				<xsl:value-of select="text()"/>

																			</xsl:otherwise>
																		</xsl:choose>
																	</xsl:for-each>

																</td>
																<td width="150"/>
															</tr>
															<tr>
																<td valign="top" width="50"/>
																<td valign="top" width="100">
																	<b>THEN</b>
																</td>
																<td width="400" valign="top"> </td>
																<td width="150">
																	<table cellpadding="0" cellspacing="0">
																		<td align="center" style="border-width: 1px;border-style: solid;border-color: #000000;" width="75">
																			<strong>Executable</strong>
																		</td>
																		<td style="border-width: 1px;border-style: solid;	border-color: #000000;" width="75" align="center">
																			<strong>Vocab</strong>
																		</td>
																	</table>
																</td>

															</tr>

															<xsl:for-each select="./gem:Directive">
																<!--<xsl:if test="normalize-space(text()) !=''">-->
																<tr>
																	<td valign="top" width="50">&#160;</td>
																	<td valign="top" width="100">&#160;</td>
																	<td valign="top" width="400">

																		<xsl:value-of select="text()"/>
																	</td>
																	<td width="150">
																		<table cellpadding="0" cellspacing="0">
																			<td align="center" style="height:25px; empty-cells: show ;border-width: 1px;border-style: solid;border-color: #000000;" width="75"/>
																			<td style="empty-cells: show;border-width: 1px;border-style: solid;	border-color: #000000;" width="75" align="center"/>
																		</table>
																	</td>


																</tr>
																<!--</xsl:if>-->
															</xsl:for-each>
															<tr>
																<td colspan="4">
																	<table border="0" cellpadding="4" cellspacing="4">
																		<tr>

																			<td valign="top" width="250">
																				<strong>Evidence Quality:</strong>
																			</td>
																			<td valign="top" width="100%">
																				<xsl:value-of select="./gem:EvidenceQuality"/>
																			</td>
																		</tr>
																		<tr>

																			<td valign="top" width="250">
																				<strong>Strength of Recommendation:</strong>
																			</td>
																			<td valign="top" width="100%">
																				<xsl:value-of select="./gem:RecommendationStrength/text()"/>
																			</td>
																		</tr>
																		<tr>

																			<td valign="top" width="250">
																				<strong>Reason:</strong>
																			</td>
																			<td valign="top" width="100%">
																				<xsl:value-of select="./gem:Reason"/>
																			</td>
																		</tr>
																		<tr>

																			<td valign="top" width="300">
																				<strong>Logic:</strong>
																			</td>
																			<td valign="top" width="100%">

																				<xsl:call-template name="break">
																					<xsl:with-param name="text">
																						<xsl:value-of select="./gem:Logic"/>
																					</xsl:with-param>
																				</xsl:call-template>

																			</td>
																		</tr>
																		<tr>

																			<td valign="top" width="300">
																				<strong>Cost:</strong>
																			</td>
																			<td valign="top" width="100%">
																				<xsl:value-of select="./gem:Cost"/>
																			</td>
																		</tr>
																		<tr>

																			<td valign="top" width="250">&#160;</td>
																			<td valign="top" width="100%">&#160;</td>
																		</tr>
																	</table>
																</td>
															</tr>
														</table>
													</td>
												</tr>

											</xsl:if>
										</xsl:if>
									</xsl:for-each>
								</xsl:for-each>
							</table>
						</td>
					</tr>
				</table>

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
