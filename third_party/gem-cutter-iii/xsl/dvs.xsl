<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:gem="http://gem.yale.edu" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output media-type="html"/>
	<xsl:strip-space elements="gem:*"/>
	<xsl:template match="/">
		<html>
			<h2>
				<xsl:value-of select="//gem:GuidelineTitle"/>
			</h2>
			<br/>
			<table style="width:100%;border-style:solid;border-width:thin;border-color:#000000">

				<tr>
					<td valign="top" class="bord" width="548" colspan="2"/>

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
										<td/>
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
										<td/>
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

							<td>&#160;</td>
							<xsl:for-each select="//gem:InclusionCriterion">
								<xsl:choose>
									<xsl:when test=" .='' "/>
									<xsl:otherwise>
										<tr>
											<td style="padding-bottom: 1px;padding-top: 10px;padding-left: 10px;padding-right: 10px;">&#183;&#160;<xsl:value-of select="text()"/></td>
											<td align="right">
												<table width="60px">
													<tr>
														<td/>
													</tr>
												</table>
											</td>
										</tr>
										<xsl:for-each select="./gem:InclusionCriterionCode">
											<xsl:if test="normalize-space(text()) !=''">
												<tr>
													<td style="padding-bottom: 1px;padding-top: 1px;padding-left: 10px;padding-right: 10px;">

														<span style="font-size:10px"> Code Set: <xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </span>

													</td>
												</tr>
											</xsl:if>
										</xsl:for-each>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:for-each>
						</xsl:when>
						<xsl:otherwise>
							<td align="right"> </td>
						</xsl:otherwise>
					</xsl:choose>
				</tr>
				<tr>
					<td style="padding-bottom: 1px;padding-top: 10px;">
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
											<td style="padding-bottom: 1px;padding-top: 10px;padding-left: 10px;padding-right: 10px;">&#183;&#160;<xsl:value-of select="text()"/></td>
											<td align="right">
												<table width="60px">
													<tr>
														<td/>
													</tr>
												</table>
											</td>
										</tr>
										<xsl:for-each select="./gem:ExclusionCriterionCode">
											<xsl:if test="normalize-space(text()) !=''">
												<tr>
													<td style="padding-bottom: 1px;padding-top: 1px;padding-left: 10px;padding-right: 10px;">

														<span style="font-size:10px"> Code Set: <xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </span>

													</td>
												</tr>
											</xsl:if>
										</xsl:for-each>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:for-each>
						</xsl:when>
						<xsl:otherwise>
							<td align="right"> </td>

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
			<br/>
			<table border="0" width="100%" cellpadding="0" cellspacing="2">
				<tr>
					<td><br/>&#160;<strong> Decision Variables</strong>
						<br/>&#160;</td>
				</tr>
				<xsl:for-each select="//gem:Recommendation">
					<xsl:for-each select="./gem:Conditional">
						<xsl:for-each select="./gem:DecisionVariable">
							<xsl:variable name="dv" select="text()"/>
							<xsl:if test="normalize-space(text()) !=''">
								<xsl:if test="text()[not(.=preceding::text())]">
									<tr>
										<td style="padding-bottom: 10px;padding-top: 10px;padding-left: 10px;padding-right: 10px;border-style:solid;border-width:thin;border-color:#000000">

											<xsl:value-of select="text()"/>

											<xsl:for-each select="//gem:DecisionVariable">
												<xsl:if test="($dv = text())">
													<table>
														<tr>
															<td style="padding-top: 10px; padding-left: 10px;padding-bottom: 1px;">
																<span style="font-size:10px"> Rec_<xsl:value-of select="../../@id"/>: Cond_<xsl:value-of select="../@id"/>: DV_<xsl:value-of select="@id"/>
																</span>
															</td>
														</tr>
														<xsl:for-each select="./gem:DecisionVariableCode">
															<xsl:if test="normalize-space(text()) !=''">
																<tr>
																	<td style="padding-bottom: 1px;padding-top: 1px;padding-left: 10px;padding-right: 10px;">

																		<span style="font-size:10px"> Code Set: <xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </span>

																	</td>
																</tr>
															</xsl:if>
														</xsl:for-each>
													</table>
												</xsl:if>
											</xsl:for-each>
										</td>
									</tr>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</xsl:for-each>
				<tr>
					<td style="border-top:thin solid #000000;"> &#160; </td>
				</tr>
			</table>
		</html>
	</xsl:template>
</xsl:stylesheet>
